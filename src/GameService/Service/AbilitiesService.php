<?php

namespace GameService\Service;

use GameService\Domain\Entity\Hub;

class AbilitiesService extends Service
{
    const ENTITY = 'Ability';

    public function findAll()
    {
        $qb = $this->getQueryBuilder(self::ENTITY);
            $qb->orderBy('Ability.sortOrder', 'ASC');
        $results = $qb->getQuery()->getArrayResult();

        $abilities = [];
        $abilitiesMapper = $this->mapperFactory->createAbilityMapper();
        foreach($results as $result) {
            $ability = $abilitiesMapper->getDomainModel($result);
            $abilities[] = $ability;
        }
        return $abilities;
    }

    public function findPresentInHub(Hub $hub)
    {
        // todo - use entity repos
        // first get the hub
        $hubEntity = $this->getQueryBuilder('Hub')
            ->select('Hub')
            ->where('Hub.id = :id')
            ->setParameter('id', $hub->getId())
            ->getQuery()->getSingleResult();

        /** @var \GameService\Data\Database\Entity\Hub $hubEntity */
        $presentAbilityIds = $hubEntity->getStatus()->getAbilities();

        $dbIds = array_map(function ($a) {
            return $a['id'];
        }, $presentAbilityIds);

        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->where(self::ENTITY . '.id IN (:ids)')
            ->setParameter('ids', $dbIds);
        $results = $qb->getQuery()->getArrayResult();
        $abilities = [];
        $abilitiesMapper = $this->mapperFactory->createAbilityMapper();

        // generate the list from the present values
        foreach ($presentAbilityIds as $ability) {
            foreach($results as $result) {
                if ($ability['id'] == $result['id']) {
                    $result['uniqueKey'] = $ability['uniqueKey'];
                    $abilities[] = $abilitiesMapper->getDomainModel($result);
                }
            }
        }
        return $abilities;
    }
}
