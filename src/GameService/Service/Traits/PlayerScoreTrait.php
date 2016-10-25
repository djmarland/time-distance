<?php

namespace GameService\Service\Traits;
use DateTime;
use DateTimeInterface;
use GameService\Data\Database\Entity\{
    Player as PlayerEntity
};

trait PlayerScoreTrait {

    protected function updatePlayerScore(
        PlayerEntity $player,
        DateTimeInterface $time = null
    ): PlayerEntity {
        $time = $this->_setTime($time);

        $secondsBetween = $time->format('U') - $player->getPointsCalculationTime()->format('U');
        $pointsEarned = $player->getPoints() + ($secondsBetween * $player->getPointsRate());

        $this->logger->info('Updating score for ' . $player->getNickname() . ': ' . $pointsEarned);
        $player->setPoints($pointsEarned);
        $player->setPointsCalculationTime($time);

        return $player;
    }

    protected function adjustPointRate(
        PlayerEntity $player,
        float $diff,
        DateTimeInterface $time
    ) {
        $time = $this->_setTime($time);

        $newRate = $player->getPointsRate() + $diff;
        $this->logger->info('New point rate for ' . $player->getNickname() . ': ' . $newRate);
        $player->setPointsRate($newRate);

        if ($newRate < 0) {
            // calculate a time of death!
            $currentPoints = $player->getPoints();
            $secondsToDie = $currentPoints / abs($newRate);
            if ($secondsToDie < 0) {
                $secondsToDie = 0;
            }

            $timeOfDeath = new DateTime($time->format('c'));
            $timeOfDeath->add(new \DateInterval('PT' . $secondsToDie . 'S'));

            $this->logger->info('Time of death for ' . $player->getNickname() . ': ' . $timeOfDeath->format('c'));
            $player->setTimeOfDeath($timeOfDeath);
        } else {
            // free from death while the points rate is not negative
            $player->setTimeOfDeath(null);
        }
        return $player;
    }

    protected function _setTime(DateTimeInterface $time = null): DateTimeInterface
    {
        if ($time) {
            return $time;
        }
        return $this->appTimeProvider;
    }
}
