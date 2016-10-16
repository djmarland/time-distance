<?php

namespace GameService\Service\Traits;
use DateTimeInterface;
use GameService\Data\Database\Entity\{
    Player as PlayerEntity
};

trait PlayerScoreTrait {
    protected function updatePlayerScore(
        PlayerEntity $player,
        DateTimeInterface $time = null
    ): PlayerEntity {
        if (!$time) {
            $time = $this->appTimeProvider;
        }

        $secondsBetween = $time->format('U') - $player->getPointsCalculationTime()->format('U');
        $pointsEarned = $player->getPoints() + ($secondsBetween * $player->getPointsRate());

        $player->setPoints($pointsEarned);
        $player->setPointsCalculationTime($time);

        return $player;
    }
}
