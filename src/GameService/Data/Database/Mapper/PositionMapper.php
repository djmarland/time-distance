<?php

namespace GameService\Data\Database\Mapper;

use GameService\Domain\Entity\Position;

class PositionMapper extends Mapper
{
    public function getDomainModel(array $item): Position
    {
        $player = null;
        if (isset($item['player'])) {
            $player = $this->mapperFactory->createHubMapper()
                ->getDomainModel($item['player']);
        }

        $location = null;
        if (isset($item['hub'])) {
            $location = $this->mapperFactory->createHubMapper()
                ->getDomainModel($item['hub']);
        } elseif (isset($item['spoke'])) {
            // todo
        }

        return new Position(
            $item['id'],
            $this->convertDateTime($item['startTime']),
            $this->convertDateTime($item['endTime']),
            $player,
            $location
        );
    }
}
