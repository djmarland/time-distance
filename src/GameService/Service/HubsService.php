<?php

namespace GameService\Service;

use Exception;
use GameService\Data\Database\Entity\ {
    Hub as HubEntity,
    Player as PlayerEntity
};
use GameService\Domain\Entity\ {
    Hub,
    Player
};
use GameService\Domain\Exception\ {
    EntityNotFoundException
};

class HubsService extends Service
{
    const ENTITY = 'Hub';

    public function findByUrlKey(
        string $urlKey
    ): Hub {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('Hub', 'Cluster')
            ->join('Hub.cluster', 'Cluster')
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

    public function takeOwnership(Hub $hub, Player $player)
    {
        // start a database transaction
        $this->entityManager->beginTransaction();

        // fetch the Hub entity
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('Hub')
            ->where('Hub.id = :id')
            ->setParameter('id', $hub->getId());
        /** @var HubEntity $hubEntity */
        $hubEntity = $qb->getQuery()->getOneOrNullResult();
        $playerEntity = $this->getPlayerEntity($player);

        try {
            // todo - create a transaction object

            // update the Hub with the ownership
            $hubEntity->setOwner($playerEntity);
            $hubEntity->setProtectionScore(0); // score becomes zero upon ownership // todo - is this correct?

            $this->entityManager->persist($hubEntity);

            // complete the transaction
            $this->entityManager->flush();
            $this->commit();
        } catch (Exception $e) {
            // rollback and rethrow
            $this->rollback();
            throw $e;
        }
    }

    private function getPlayerEntity(Player $player): PlayerEntity
    {
        // todo - move these to EntityRepos
        /** @var PlayerEntity $playerEntity */
        return $this->getEntity('Player')->findByDbId($player->getId());
    }
}
