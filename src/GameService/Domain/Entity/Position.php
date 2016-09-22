<?php

namespace GameService\Domain\Entity;

use DateTimeImmutable;
use GameService\Domain\Exception\DataNotFetchedException;
use InvalidArgumentException;

class Position extends Entity
{
    private $player;
    private $location;
    private $startTime;
    private $endTime;

    public function __construct(
        int $id,
        DateTimeImmutable $startTime,
        DateTimeImmutable $endTime = null,
        Player $player = null,
        $location = null
    ) {
        parent::__construct($id);
        if ($location instanceof Hub || is_null($location)) {
            $this->location = $location;
        } else {
            throw new InvalidArgumentException('Location missing or not recognised');
        }

        $this->player = $player;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
    }

    public function getArrivalTime(): DateTimeImmutable
    {
        return $this->startTime;
    }

    public function getArrivalTimeData(): string
    {
        return $this->startTime->format('c');
    }

    public function getExitTime(): DateTimeImmutable
    {
        return $this->endTime;
    }

    public function getExitTimeData()
    {
        return $this->endTime ? $this->endTime->format('c') : null;
    }

    public function getPlayer(): Player
    {
        if (is_null($this->player)) {
            throw new DataNotFetchedException('Tried to get player data but it was not fetched');
        }
        return $this->player;
    }

    public function getLocation()
    {
        if (is_null($this->location)) {
            throw new DataNotFetchedException('Tried to get location data but it was not fetched');
        }
        return $this->location;
    }

    public function isInHub()
    {
        return ($this->location instanceof Hub);
    }

    public function getLocationType()
    {
        if ($this->isInHub()) {
            return 'hub';
        }
        return '';
    }
}
