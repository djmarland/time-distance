<?php
namespace GameService\Data\Database\EntityRepository;

use DateTimeInterface;
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

    public function findDeadPlayers(DateTimeInterface $time, int $limit = 100): array
    {
        return $this->createQueryBuilder('Player')
            ->select('Player')
            ->where('Player.timeOfDeath IS NOT NULL')
            ->andWhere('Player.timeOfDeath <= :time')
            ->setParameter('time', $time)
            ->orderBy('Player.timeOfDeath', 'ASC') // start with oldest
            ->setMaxResults($limit)
            ->getQuery()->getResult();
    }
}