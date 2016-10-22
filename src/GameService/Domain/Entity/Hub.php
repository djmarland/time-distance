<?php

namespace GameService\Domain\Entity;

use GameService\Domain\Entity\Null\NullPlayer;
use GameService\Domain\Exception\DataNotFetchedException;

class Hub extends Entity implements \JsonSerializable
{
    private $name;
    private $urlKey;
    private $cluster;
    private $xCoordinate;
    private $yCoordinate;
    private $isHaven;
    private $protectionScore;
    private $owner;

    public function __construct(
        int $id,
        string $name,
        string $urlKey,
        int $xCoordinate,
        int $yCoordinate,
        bool $isHaven,
        int $protectionScore = null,
        Cluster $cluster = null,
        Player $owner = null
    ) {
        parent::__construct($id);

        $this->name = $name;
        $this->urlKey = $urlKey;
        $this->cluster = $cluster;
        $this->xCoordinate = $xCoordinate;
        $this->yCoordinate = $yCoordinate;
        $this->isHaven = $isHaven;
        $this->protectionScore = $protectionScore;
        $this->owner = $owner;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getUrlKey(): string
    {
        return $this->urlKey;
    }

    public function getXCoordinate(): int
    {
        return $this->xCoordinate;
    }

    public function getYCoordinate(): int
    {
        return $this->yCoordinate;
    }

    public function getProtectionScore()
    {
        return $this->protectionScore;
    }

    /**
     * @return Player|null
     * @throws DataNotFetchedException
     */
    public function getOwner()
    {
        // null means this hub has no owner. NullPlayer means the data wasn't fetched
        if ($this->owner instanceof NullPlayer) {
            throw new DataNotFetchedException(
                'Tried to fetch hub owner but the data was not available'
            );
        }
        return $this->owner;
    }

    public function getCluster(): Cluster
    {
        if (is_null($this->cluster)) {
            throw new DataNotFetchedException('Tried to fetch cluster but the data was not available');
        }
        return $this->cluster;
    }

    public function getClusterName(): string
    {
        return $this->getCluster()->getName();
    }

    public function isHaven(): bool
    {
        return $this->isHaven;
    }

    public function getUrl(): string
    {
        return '/hubs/' . $this->getUrlKey();
    }

    public function hasAbility(string $id): bool
    {
        foreach ($this->presentAbilityIds as $abilityId) {
            if ($id == $abilityId->unique) {
                return true;
            }
        }
        return false;
    }

    public function jsonSerialize()
    {
        $data = [
            'type' => 'hub',
            'url' => $this->getUrl(),
            'name' => $this->getName(),
            'isHaven' => $this->isHaven(),
            'protectionScore' => $this->getProtectionScore(),
        ];

        if (!($this->owner instanceof NullPlayer)) {
            $data['owner'] = $this->getOwner();
        }

        if (!is_null($this->cluster)) {
            $data['cluster'] = $this->getCluster();
        }
        return $data;
    }
}
