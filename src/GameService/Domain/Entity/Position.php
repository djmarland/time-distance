<?php

namespace GameService\Domain\Entity;

use DateTimeImmutable;
use GameService\Domain\Exception\DataNotFetchedException;
use InvalidArgumentException;

class Position extends Entity implements \JsonSerializable
{
    private $player;
    private $location;
    private $startTime;
    private $endTime;
    private $isReverseDirection;

    public function __construct(
        int $id,
        DateTimeImmutable $startTime,
        DateTimeImmutable $endTime = null,
        Player $player = null,
        $location = null,
        $isReverseDirection = false
    ) {
        parent::__construct($id);
        if ($location instanceof Hub || $location instanceof Spoke || is_null($location)) {
            $this->location = $location;
        } else {
            throw new InvalidArgumentException('Location missing or not recognised');
        }

        $this->player = $player;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
        $this->isReverseDirection = $isReverseDirection;
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

    public function isReverseDirection(): bool
    {
        return $this->isReverseDirection;
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

    public function getLocationType(): string
    {
        if ($this->isInHub()) {
            return 'hub';
        }
        return 'spoke';
    }

    public function jsonSerialize()
    {
        $destination = null;
        if (!$this->isInHub()) {
            $destination = $this->getLocation()->getDestinationHubFromDirection($this->isReverseDirection());
        }

        return [
            'isInHub' => $this->isInHub(),
            'exitTime' => $this->getExitTimeData(),
            'location' => $this->getLocation(),
            'destination' => $destination,
        ];
    }
}
