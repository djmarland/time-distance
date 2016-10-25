<?php
namespace GameService\Data\Database\EntityRepository;

use Doctrine\ORM\EntityRepository;
use GameService\Data\Database\Entity\Hub;
use GameService\Data\Database\Entity\Player;
use GameService\Data\Database\Entity\Position;

class PositionRepository extends EntityRepository
{
    public function findPositionForPlayer(Player $player): Position
    {
        return $this->createQueryBuilder('Position')
            ->select('Position', 'Hub', 'Spoke')
            ->leftJoin('Position.hub', 'Hub')
            ->leftJoin('Position.spoke', 'Spoke')
            ->where('Position.player = :player')
            ->setParameter('player', $player)
            ->getQuery()->getOneOrNullResult();
    }

    public function findHubPositionForPlayerWithOwner(Player $player): Position
    {
        return $this->createQueryBuilder('Position')
            ->select('Position', 'Hub', 'Owner')
            ->leftJoin('Position.hub', 'Hub')
            ->leftJoin('Hub.owner', 'Owner')
            ->where('Position.player = :player')
            ->andWhere('Position.completedTime IS NULL')
            ->setParameter('player', $player)
            ->setMaxResults(1)
            ->getQuery()->getOneOrNullResult();
    }
}