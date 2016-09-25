<?php

namespace GameService\Domain\Entity;

use GameService\Domain\Exception\DataNotFetchedException;
use GameService\Domain\ValueObject\Bearing;

class Spoke extends Entity implements \JsonSerializable
{
    private $startHub;
    private $endHub;
    private $bearing;
    private $distance;

    public function __construct(
        int $id,
        Hub $startHub,
        Hub $endHub,
        Bearing $bearing,
        int $distance
//        $status
    ) {
        parent::__construct($id);

        $this->startHub = $startHub;
        $this->endHub = $endHub;
        $this->bearing = $bearing;
        $this->distance = $distance;
    }

    public function getStartHub(): Hub
    {
        if (is_null($this->startHub)) {
            throw new DataNotFetchedException('Tried to get hub data but it was not fetched');
        }
        return $this->startHub;
    }

    public function getEndHub(): Hub
    {
        if (is_null($this->endHub)) {
            throw new DataNotFetchedException('Tried to get hub data but it was not fetched');
        }
        return $this->endHub;
    }

    public function getBearing(): Bearing
    {
        return $this->bearing;
    }

    public function getDistance(): int
    {
        return $this->distance;
    }

    public function getRelativeBearing(Hub $hub)
    {
        if ($this->getStartHub()->getId() == $hub->getId()) {
            return $this->getBearing();
        }
        return $this->getBearing()->getOpposite();
    }

    public function getDestinationHub(Hub $hub)
    {
        if ($this->getStartHub()->getId() == $hub->getId()) {
            return $this->getEndHub();
        }
        return $this->getStartHub();
    }

    public function getOriginHub(Hub $hub)
    {
        if ($this->getStartHub()->getId() == $hub->getId()) {
            return $this->getStartHub();
        }
        return $this->getEndHub();
    }

    public function getDestinationHubFromDirection($reversed = true)
    {
        if ($reversed) {
            return $this->getStartHub();
        }
        return $this->getEndHub();
    }

    public function getOriginHubFromDirection($reversed = true)
    {
        if ($reversed) {
            return $this->getEndHub();
        }
        return $this->getStartHub();
    }

    public function isReverseDirection(Hub $hub)
    {
        // if the current hub is the start point, then we're going in the standard
        // direction. If not, then we're going in the reverse direction
        return ($this->getStartHub()->getId() != $hub->getId());
    }

    public function crossesTheVoid()
    {
        return (
            $this->getStartHub()->getCluster()->getId() !=
            $this->getEndHub()->getCluster()->getId()
        );
    }

    public function jsonSerialize()
    {
        return [

        ];
    }
}
