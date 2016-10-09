<?php

namespace GameService\Service;

use GameService\Domain\Entity\Player;
use GameService\Domain\Entity\Position;
use GameService\Domain\Exception\EntityNotFoundException;

class PositionsService extends Service
{
    const ENTITY = 'Position';

    public function findFullCurrentPositionForPlayer(
        Player $player
    ): Position {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->select(
            'Position', 'Hub', 'Owner', 'Spoke', 'Cluster', 'SpokeStartHub',
            'SpokeEndHub', 'SpokeStartCluster', 'SpokeEndCluster'
            )
            ->leftJoin('Position.hub', 'Hub')
            ->leftJoin('Hub.cluster', 'Cluster')
            ->leftJoin('Hub.owner', 'Owner')
            ->leftJoin('Position.spoke', 'Spoke')
            ->leftJoin('Spoke.startHub', 'SpokeStartHub')
            ->leftJoin('SpokeStartHub.cluster', 'SpokeStartCluster')
            ->leftJoin('Spoke.endHub', 'SpokeEndHub')
            ->leftJoin('SpokeEndHub.cluster', 'SpokeEndCluster')
            ->where('Position.player = :playerId')
            ->andWhere('Position.completedTime IS NULL')
            ->setParameter('playerId', $player->getId())
            ->setMaxResults(1);
        $result = $qb->getQuery()->getArrayResult();
        if (empty($result)) {
            throw new EntityNotFoundException('No such position');
        }
        return $this->mapperFactory->createPositionMapper()
            ->getDomainModel(reset($result));
    }
}
