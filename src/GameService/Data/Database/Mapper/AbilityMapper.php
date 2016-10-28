<?php

namespace GameService\Data\Database\Mapper;

use GameService\Domain\Entity\Ability;

class AbilityMapper extends Mapper
{
    public function getDomainModel(array $item): Ability
    {
        $domain = new Ability(
            $item['id'],
            $item['name'],
            $item['imageKey'],
            $item['type'],
            $item['class'],
            $item['description'],
            $item['spawnRate'],
            $item['isMystery'],
            $item['uniqueKey'] ?? null
        );
        return $domain;
    }
}
