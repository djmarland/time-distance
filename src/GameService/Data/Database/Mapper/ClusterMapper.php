<?php

namespace GameService\Data\Database\Mapper;

use GameService\Domain\Entity\Cluster;

class ClusterMapper extends Mapper
{
    public function getDomainModel(array $item): Cluster
    {
        $domain = new Cluster(
            $item['id'],
            $item['name']
        );
        return $domain;
    }
}
