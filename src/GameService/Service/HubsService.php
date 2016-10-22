<?php

namespace GameService\Service;

use Exception;
use GameService\Data\Database\Entity\{
    Hub as HubEntity,
    Player as PlayerEntity,
    Transaction as TransactionEntity
};
use GameService\Domain\Entity\ {
    Hub,
    Player
};
use GameService\Domain\Exception\{
    EntityNotFoundException, InsufficientFundsException
};

class HubsService extends Service
{
    use Traits\PlayerScoreTrait;

    const ENTITY = 'Hub';

    public function findByUrlKey(
        string $urlKey
    ): Hub {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('Hub', 'Cluster', 'Player')
            ->join('Hub.cluster', 'Cluster')
            ->leftJoin('Hub.owner', 'Player')
            ->where('Hub.urlKey = :urlKey')
            ->setParameter('urlKey', $urlKey);
        $result = $qb->getQuery()->getArrayResult();
        if (empty($result)) {
            throw new EntityNotFoundException('No such hub');
        }
        return $this->mapperFactory->createHubMapper()
            ->getDomainModel(reset($result));
    }

    public function findAllInCoordinates(): array
    {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('Hub', 'Cluster')
            ->join('Hub.cluster', 'Cluster');
        $results = $qb->getQuery()->getArrayResult();
        $hubs = [];
        $hubMapper = $this->mapperFactory->createHubMapper();
        foreach($results as $result) {
            $hub = $hubMapper->getDomainModel($result);
            $y = $hub->getYCoordinate();
            $x = $hub->getXCoordinate();
            if (!isset($hubs[$x])) {
                $hubs[$x] = [];
            }
            $hubs[$x][$y] = $hub;
        }
        return $hubs;
    }

    public function findAllDetailed(): array
    {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('Hub', 'Cluster')
            ->join('Hub.cluster', 'Cluster');
        $results = $qb->getQuery()->getArrayResult();
        $hubs = [];
        $hubMapper = $this->mapperFactory->createHubMapper();
        foreach($results as $result) {
            $hub = $hubMapper->getDomainModel($result);
            $hubs[] = $hub;
        }
        return $hubs;
    }

    public function takeOwnership(Hub $hub, Player $player, int $cost)
    {
        // start a database transaction
        $this->entityManager->beginTransaction();

        // fetch the Hub entity
        $hubEntity = $this->getHubEntity($hub);
        $playerEntity = $this->getPlayerEntity($player);

        // get all the players currently this hub
        $playersPresent = $this->getQueryBuilder('Player')
            ->select('Player')
            ->leftJoin(
                'GameService:Position',
                'Position',
                \Doctrine\ORM\Query\Expr\Join::WITH,
                'Position.player = Player'
            )
            ->join('Position.hub', 'Hub')
            ->where('Hub = :hub')
            ->andWhere('Position.completedTime IS NULL')
            // ignore the person taking ownership (obviously)
            ->andWhere('Player != :player')
            ->setParameter('hub', $hubEntity)
            ->setParameter('player', $playerEntity)
            ->getQuery()->getResult();

        // calculate the players score
        $playerEntity = $this->updatePlayerScore($playerEntity);

        if ($playerEntity->getPoints() < $cost) {
            throw new InsufficientFundsException();
        }

        // take the purchase cost from the player
        $playerEntity->deductPoints($cost);

        try {
            // todo - create a transaction object
            $transaction = new TransactionEntity($playerEntity, $hubEntity, 'purchase', $cost);

            // update the Hub with the ownership
            $hubEntity->setOwner($playerEntity);
            $hubEntity->setProtectionScore(0); // score becomes zero upon ownership

            // todo - this could be difficult to scale if hundreds?
            $squattersCount = count($playersPresent);
            // increase the player entity score by the squatter count
            $playerEntity->setPointsRate($playerEntity->getPointsRate() + $squattersCount);

            // for every player (that is not the owner) decrease their rate
            foreach ($playersPresent as $i => $squatter) {
                $squatter = $this->updatePlayerScore($squatter);
                $squatter->setPointsRate($squatter->getPointsRate() - 1);
                $this->entityManager->persist($squatter);
            }

            $this->entityManager->persist($transaction);
            $this->entityManager->persist($hubEntity);
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

    public function takeAbility(Hub $hub, Player $player, string $uniqueKey)
    {
        // start a database transaction
        $this->entityManager->beginTransaction();

        // fetch the Hub entity
        $hubEntity = $this->getHubEntity($hub);
        $playerEntity = $this->getPlayerEntity($player);

        try {
            $hubStatus = $hubEntity->getStatus();
            $abilityId = $hubStatus->removeAbilityByKey($uniqueKey);
            $hubEntity->setStatus($hubStatus);

            $playerStatus = $playerEntity->getStatus();
            $playerStatus->addAbility($abilityId);
            $playerEntity->setStatus($playerStatus);

            $this->entityManager->persist($hubEntity);
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

    public function addAbilities(Hub $hub, array $abilitiesToAdd)
    {
        // fetch the Hub entity
        $hubEntity = $this->getHubEntity($hub);

        $currentStatus = $hubEntity->getStatus();
        foreach($abilitiesToAdd as $ability) {
            $currentStatus->createAbility($ability->getId());
        }
        $hubEntity->setStatus($currentStatus);

        $this->entityManager->persist($hubEntity);
        $this->entityManager->flush();
    }

    private function getPlayerEntity(Player $player): PlayerEntity
    {
        // todo - move these to EntityRepos (findbyId)
        /** @var PlayerEntity $playerEntity */
        return $this->getEntity('Player')->findByDbId($player->getId());
    }

    private function getHubEntity(Hub $hub): HubEntity
    {
        // todo - move these to EntityRepos (findbyId)
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('Hub')
            ->where('Hub.id = :id')
            ->setParameter('id', $hub->getId());
        /** @var HubEntity $hubEntity */
        return $qb->getQuery()->getOneOrNullResult();
    }
}
