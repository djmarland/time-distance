<?php

namespace GameService\Service;

use GameService\Domain\Entity\Hub;
use GameService\Domain\Exception\EntityNotFoundException;

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
}
