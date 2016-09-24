<?php

namespace GameService\Service;

use GameService\Domain\Entity\Hub;
use GameService\Domain\Exception\EntityNotFoundException;

class SpokesService extends Service
{
    const ENTITY = 'Spoke';

    public function findForHubDetailed(
        Hub $hub
    ): array {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select('Spoke', 'StartHub', 'EndHub', 'StartCluster', 'EndCluster')
            ->join('Spoke.startHub', 'StartHub')
            ->join('StartHub.cluster', 'StartCluster')
            ->join('Spoke.endHub', 'EndHub')
            ->join('EndHub.cluster', 'EndCluster')
            ->where('Spoke.startHub = :hub')
            ->orWhere('Spoke.endHub = :hub')
            ->setParameter('hub', $hub->getId());
        $results = $qb->getQuery()->getArrayResult();

        $spokes = [];
        $spokeMapper = $this->mapperFactory->createSpokeMapper();
        foreach($results as $result) {
            $spoke = $spokeMapper->getDomainModel($result);
            $spokes[] = $spoke;
        }
        return $spokes;
    }


}
