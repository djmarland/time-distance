<?php

namespace GameService\Data\Database\Mapper;

use GameService\Domain\Entity\Spoke;
use GameService\Domain\ValueObject\Bearing;

class SpokeMapper extends Mapper
{
    public function getDomainModel(array $item): Spoke
    {
        $hubMapper = $this->mapperFactory->createHubMapper();
        $startHub = null;
        $endHub = null;

        if (isset($item['startHub'])) {
            $startHub = $hubMapper->getDomainModel($item['startHub']);
        }

        if (isset($item['endHub'])) {
            $endHub = $hubMapper->getDomainModel($item['endHub']);
        }

        $domain = new Spoke(
            $item['id'],
            $startHub,
            $endHub,
            new Bearing($item['bearing']),
            $item['distance']
        );
        return $domain;
    }
}
