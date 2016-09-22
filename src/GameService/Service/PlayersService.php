<?php

namespace GameService\Service;

use Exception;
use GameService\Data\Database\Entity\Hub;
use GameService\Data\Database\Entity\Player as PlayerEntity;
use GameService\Data\Database\Entity\Position;
use GameService\Domain\Entity\Player;
use GameService\Domain\Exception\EntityNotFoundException;
use GameService\Domain\ValueObject\Nickname;

class PlayersService extends Service
{
    const ENTITY = 'Player';

    public function findByNickname(
        string $nickname
    ): Player {
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

    public function newPlayer(
        string $nickname
    ): Player {
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

    public function movePlayerToHub(Player $player, string $hubKey)
    {
        // todo - move these to EntityRepos
        /** @var Hub $hub */
        $playerEntity = $this->getQueryBuilder('Player')
            ->select('Player')
            ->where('Player.id = :id')
            ->setParameter('id', $player->getId())
            ->getQuery()->getOneOrNullResult();

        /** @var Hub $hub */
        $hub = $this->getQueryBuilder('Hub')
            ->select('Hub')
            ->where('Hub.urlKey = :urlKey')
            ->setParameter('urlKey', $hubKey)
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

        // start transaction
        $this->entityManager->beginTransaction();

        try {
            // close old position
            $position->setCompletedTime($this->appTimeProvider);
            $this->entityManager->persist($position);

            // make a new position
            $newPosition = new Position($playerEntity, $this->appTimeProvider, $hub);
            $this->entityManager->persist($newPosition);

            // todo - calculate new point rate

            // complete the transaction
            $this->entityManager->flush();
            $this->commit();
        } catch (Exception $e) {
            // rollback and rethrow
            $this->rollback();
            throw $e;
        }
    }

    private function fetchRandomHavenHubEntity(): Hub
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
