<?php

namespace GameService\Data\Database\Mapper;

use GameService\Domain\Entity\Hub;

class HubMapper extends Mapper
{
    public function getDomainModel(array $item): Hub
    {
        $cluster = null;
        if (isset($item['cluster'])) {
            $cluster = $this->mapperFactory->createClusterMapper()
                ->getDomainModel($item['cluster']);
        }

        return new Hub(
            $item['id'],
            $item['name'],
            $item['urlKey'],
            $item['xCoordinate'],
            $item['yCoordinate'],
            $item['isHaven'],
            $cluster
        );
    }
}
