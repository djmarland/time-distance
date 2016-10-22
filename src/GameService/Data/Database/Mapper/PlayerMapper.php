<?php

namespace GameService\Data\Database\Mapper;

use GameService\Data\Database\Entity\Status\PlayerStatus;
use GameService\Domain\Entity\Player;
use GameService\Domain\ValueObject\Nickname;

class PlayerMapper extends Mapper
{
    public function getDomainModel(array $item): Player
    {
        $homeHub = null;
        if (isset($item['homeHub'])) {
            $homeHub = $this->mapperFactory->createHubMapper()
                ->getDomainModel($item['homeHub']);
        }

        $status = new PlayerStatus($item['status'] ?? null);

        return new Player(
            $item['id'],
            new Nickname($item['nickname']),
            $item['points'],
            $item['pointsRate'],
            $this->convertDateTime($item['pointsCalculationTime']),
            $status->getAbilityCounts(),
            $homeHub
        );
    }
}
