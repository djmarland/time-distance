<?php

namespace GameService\Data\Database\Mapper;

use GameService\Domain\Entity\Hub;
use GameService\Domain\Entity\Null\NullPlayer;

class HubMapper extends Mapper
{
    public function getDomainModel(array $item): Hub
    {
        $cluster = null;
        if (isset($item['cluster'])) {
            $cluster = $this->mapperFactory->createClusterMapper()
                ->getDomainModel($item['cluster']);
        }

        $owner = null;
        if (array_key_exists('owner', $item)) {
            if (!is_null($item['owner'])) {
                $owner = $this->mapperFactory->createPlayerMapper()
                    ->getDomainModel($item['owner']);
            }
        } else {
            $owner = new NullPlayer();
        }

        $presentAbilities = [];
        if (isset($item['status'])) {
            if (isset($item['status']['abilities'])) {
                $presentAbilities = $item['status']['abilities'];
            }
        }

        return new Hub(
            $item['id'],
            $item['name'],
            $item['urlKey'],
            $item['xCoordinate'],
            $item['yCoordinate'],
            $item['isHaven'],
            $item['protectionScore'],
            $cluster,
            $owner,
            $presentAbilities
        );
    }
}
