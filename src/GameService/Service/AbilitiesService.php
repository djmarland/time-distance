<?php

namespace GameService\Service;

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
}
