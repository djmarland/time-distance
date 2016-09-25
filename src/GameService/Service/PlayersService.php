<?php

namespace GameService\Service;

use DateTimeImmutable;
use DateTimeInterface;
use Doctrine\ORM\QueryBuilder;
use Exception;
use GameService\Data\Database\Entity\Hub as HubEntity;
use GameService\Data\Database\Entity\Player as PlayerEntity;
use GameService\Data\Database\Entity\Spoke as SpokeEntity;
use GameService\Data\Database\Entity\Position;
use GameService\Domain\Entity\Hub;
use GameService\Domain\Entity\Player;
use GameService\Domain\Entity\Spoke;
use GameService\Domain\Exception\EntityNotFoundException;
use GameService\Domain\ValueObject\Nickname;

class PlayersService extends Service
{
    const ENTITY = 'Player';

    public function findAll()
    {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('Player')
            ->orderBy('Player.nickname');

        return $this->getPlayersResult($qb);
    }

    public function countAll()
    {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('count(Player)');
        return $qb->getQuery()->getSingleScalarResult();
    }

    public function countThoseInHubs()
    {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('count(Player)')
            ->leftJoin(
                'GameService:Position',
                'Position',
                \Doctrine\ORM\Query\Expr\Join::WITH,
                'Position.player = Player'
            )
            ->andWhere('Position.completedTime IS NULL')
            ->andWhere('Position.hub IS NOT NULL');
        return $qb->getQuery()->getSingleScalarResult();
    }

    public function countThoseInHavenHubs()
    {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('count(Player)')
            ->leftJoin(
                'GameService:Position',
                'Position',
                \Doctrine\ORM\Query\Expr\Join::WITH,
                'Position.player = Player'
            )
            ->join('Position.hub', 'Hub')
            ->andWhere('Position.completedTime IS NULL')
            ->andWhere('Hub.isHaven = true');
        return $qb->getQuery()->getSingleScalarResult();
    }

    public function countThoseTravelling()
    {
        return 0;
//        $qb = $this->getQueryBuilder(self::ENTITY);
//        $qb->select('count(Player.id)');
//        return $qb->getQuery()->getSingleScalarResult();
    }

    public function totalPoints()
    {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('sum(Player.points)');
        return $qb->getQuery()->getSingleScalarResult();
    }

    public function overallPointRate()
    {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('sum(Player.pointsRate)');
        return $qb->getQuery()->getSingleScalarResult();
    }

    public function findByNickname(
        string $nickname
    ): Player
    {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('Player')
            ->where('Player.nickname = :nickname')
            ->setParameter('nickname', $nickname);
        $result = $qb->getQuery()->getArrayResult();
        if (empty($result)) {
            throw new EntityNotFoundException('No such player');
        }
        return $this->mapperFactory->createPlayerMapper()
            ->getDomainModel(reset($result));
    }

    public function findInHub(
        Hub $hub
        // todo - paginate this to sensible number
    )
    {

        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('Player')
            ->leftJoin(
                'GameService:Position',
                'Position',
                \Doctrine\ORM\Query\Expr\Join::WITH,
                'Position.player = Player'
            )
            ->join('Position.hub', 'Hub')
            ->where('Hub = :hubId')
            ->andWhere('Position.completedTime IS NULL')
            ->orderBy('Player.nickname')
            ->setParameter('hubId', $hub->getId());

        return $this->getPlayersResult($qb);
    }

    public function newPlayer(
        string $nickname
    ): Player
    {
        $nickname = Nickname::validate($nickname);

        $now = $this->appTimeProvider;

        $startingHub = $this->fetchRandomHavenHubEntity();

        // start a transaction
        $this->entityManager->beginTransaction();

        try {
            // create the player
            $initialPoints = 0;
            $initialPointsRate = 0;
            $initialPointsTime = $now;
            $player = new PlayerEntity(
                $nickname,
                $initialPoints,
                $initialPointsRate,
                $initialPointsTime,
                $startingHub
            );
            $this->entityManager->persist($player);

            // create a new position with the player in their home hub
            $position = new Position($player, $now, $startingHub);
            $this->entityManager->persist($position);

            // complete the transaction
            $this->entityManager->flush();
            $this->commit();
        } catch (Exception $e) {
            // rollback and rethrow
            $this->rollback();
            throw $e;
        }

        // fetch and return the new player
        return $this->findByNickname($nickname);
    }

    public function movePlayerToHub(Player $player, Hub $hub)
    {
        // todo - move these to EntityRepos
        /** @var PlayerEntity $playerEntity */
        $playerEntity = $this->getQueryBuilder('Player')
            ->select('Player')
            ->where('Player.id = :id')
            ->setParameter('id', $player->getId())
            ->getQuery()->getOneOrNullResult();

        /** @var HubEntity $hubEntity */
        $hubEntity= $this->getQueryBuilder('Hub')
            ->select('Hub')
            ->where('Hub = :hub')
            ->setParameter('hub', $hub->getId())
            ->getQuery()->getOneOrNullResult();

        // get current position
        /** @var Position $position */
        $position = $this->getQueryBuilder('Position')
            ->select('Position')
            ->where('Position.player = :playerId')
            ->andWhere('Position.completedTime IS NULL')
            ->setParameter('playerId', $player->getId())
            ->setMaxResults(1)
            ->getQuery()->getOneOrNullResult();

        // we need to save the players accurate score
        // coming from a spoke all times were based on the previous position end time
        $calculationTime = $position->getEndTime();

        $playerEntity = $this->updatePlayerScore($playerEntity, $calculationTime);

        // we're moving from a hub to a spoke. The point rate loses 1
        $pointRate = $playerEntity->getPointsRate() - 1;
        $playerEntity->setPointsRate($pointRate);

        // start transaction
        $this->entityManager->beginTransaction();

        try {
            // close old position
            $position->setCompletedTime($calculationTime);
            $this->entityManager->persist($position);

            // make a new position
            $newPosition = new Position($playerEntity, $calculationTime, $hubEntity);
            $this->entityManager->persist($newPosition);

            $this->entityManager->persist($playerEntity);

            // complete the transaction
            $this->entityManager->flush();
            $this->commit();
        } catch (Exception $e) {
            // rollback and rethrow
            $this->rollback();
            throw $e;
        }
    }

    public function movePlayerToSpoke(
        Player $player,
        Spoke $spoke,
        DateTimeImmutable $endTime,
        bool $reverseDirection
    ) {
        // todo - move these to EntityRepos
        /** @var PlayerEntity $playerEntity */
        $playerEntity = $this->getEntity('Player')->findByDbId($player->getId());

        /** @var SpokeEntity $spokeEntity */
        $spokeEntity= $this->getQueryBuilder('Spoke')
            ->select('Spoke')
            ->where('Spoke = :spoke')
            ->setParameter('spoke', $spoke->getId())
            ->getQuery()->getOneOrNullResult();

        // get current position
        /** @var Position $position */
        $position = $this->getQueryBuilder('Position')
            ->select('Position')
            ->where('Position.player = :playerId')
            ->andWhere('Position.completedTime IS NULL')
            ->setParameter('playerId', $player->getId())
            ->setMaxResults(1)
            ->getQuery()->getOneOrNullResult();

        // we need to save the players accurate score
        $playerEntity = $this->updatePlayerScore($playerEntity);

        // we're moving from a hub to a spoke. The point rate gains 1
        $pointRate = $playerEntity->getPointsRate() + 1;
        $playerEntity->setPointsRate($pointRate);

        // start transaction
        $this->entityManager->beginTransaction();

        try {
            // close old position
            $position->setCompletedTime($this->appTimeProvider);
            $this->entityManager->persist($position);

            // make a new position
            $newPosition = new Position($playerEntity, $this->appTimeProvider, $spokeEntity);
            $newPosition->setReverseDirection($reverseDirection);
            $newPosition->setEndTime($endTime);
            $this->entityManager->persist($newPosition);

            $this->entityManager->persist($playerEntity);

            // complete the transaction
            $this->entityManager->flush();
            $this->commit();
        } catch (Exception $e) {
            // rollback and rethrow
            $this->rollback();
            throw $e;
        }
    }

    private function updatePlayerScore(PlayerEntity $player, DateTimeInterface $time = null): PlayerEntity
    {
        if (!$time) {
            $time = $this->appTimeProvider;
        }

        $secondsBetween = $time->format('U') - $player->getPointsCalculationTime()->format('U');
        $pointsEarned = $player->getPoints() + ($secondsBetween * $player->getPointsRate());

        $player->setPoints($pointsEarned);
        $player->setPointsCalculationTime($time);

        return $player;
    }

    private function getPlayersResult(QueryBuilder $qb): array
    {
        $result = $qb->getQuery()->getArrayResult();
        $players = [];
        $mapper = $this->mapperFactory->createPlayerMapper();
        foreach ($result as $player) {
            $players[] = $mapper->getDomainModel($player);
        }
        return $players;
    }

    private function fetchRandomHavenHubEntity(): HubEntity
    {
        // first we need to know how many hubs we have
        $number = $this->getQueryBuilder('Hub')
            ->select('count(Hub.id)')
            ->where('Hub.isHaven = true')
            ->getQuery()->getSingleScalarResult();

        // then we'll pick a random offset
        $offset = mt_rand(0, $number - 1);

        // now we'll select that random row
        return $this->getQueryBuilder('Hub')
            ->select('Hub')
            ->where('Hub.isHaven = true')
            ->setMaxResults(1)
            ->setFirstResult($offset)
            ->getQuery()->getOneOrNullResult();
    }
}
