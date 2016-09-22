<?php

namespace GameService\Data\Database\Mapper;

/**
 * Factory to create mappers as needed
 */
class MapperFactory
{
    public function createClusterMapper(): ClusterMapper
    {
        return new ClusterMapper($this);
    }

    public function createHubMapper(): HubMapper
    {
        return new HubMapper($this);
    }

    public function createPlayerMapper(): PlayerMapper
    {
        return new PlayerMapper($this);
    }

    public function createPositionMapper(): PositionMapper
    {
        return new PositionMapper($this);
    }
}
