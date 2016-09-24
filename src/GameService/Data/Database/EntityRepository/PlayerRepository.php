<?php
namespace GameService\Data\Database\EntityRepository;

use Doctrine\ORM\EntityRepository;

class PlayerRepository extends EntityRepository
{
    public function findByDbId(int $dbId)
    {
        return $this->createQueryBuilder('Player')
            ->select('Player')
            ->where('Player.id = :id')
            ->setParameter('id', $dbId)
            ->getQuery()->getOneOrNullResult();
    }
}