<?php
namespace GameService\Data\Database\EntityRepository;

use Doctrine\ORM\EntityRepository;
use GameService\Data\Database\Entity\Hub;

class HubRepository extends EntityRepository
{
    public function countAll()
    {
        return $this->createQueryBuilder('Hub')
            ->select('count(1)')
            ->getQuery()->getSingleScalarResult();
    }

    /**
     * @param $id
     * @return Hub|null
     */
    public function getHubByIdWithOwner($id)
    {
        return $this->createQueryBuilder('Hub')
            ->select('Hub', 'Owner')
            ->leftJoin('Hub.owner', 'Owner')
            ->where('Hub = :hub')
            ->setParameter('hub', $id)
            ->getQuery()->getOneOrNullResult();
    }

    public function getSingleHubAtOffset(int $offset): Hub
    {
        return $this->createQueryBuilder('Hub')
            ->select('Hub')
            ->setMaxResults(1)
            ->setFirstResult($offset)
            ->getQuery()->getOneOrNullResult();
    }
}