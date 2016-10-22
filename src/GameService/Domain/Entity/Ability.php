<?php

namespace GameService\Domain\Entity;

use GameService\Domain\Exception\DataNotFetchedException;

class Ability extends Entity implements \JsonSerializable
{
    private $name;
    private $imageKey;
    private $type;
    private $description;
    private $spawnRate;
    private $isMystery;
    private $uniqueKey;

    public function __construct(
        int $id,
        string $name,
        string $imageKey,
        string $type,
        string $description,
        float $spawnRate,
        bool $isMystery,
        string $uniqueKey = null
    ) {
        parent::__construct($id);

        $this->name = $name;
        $this->imageKey = $imageKey;
        $this->type = $type;
        $this->description = $description;
        $this->spawnRate = $spawnRate;
        $this->isMystery = $isMystery;
        $this->uniqueKey = $uniqueKey;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getImageKey(): string
    {
        return $this->imageKey;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function isMystery(): bool
    {
        return $this->isMystery;
    }

    public function getUniqueKey()
    {
        if (is_null($this->uniqueKey)) {
            throw new DataNotFetchedException('Tried to find a uniqueKey out of context');
        }
        return $this->uniqueKey;
    }

    /**
     * based on the spawn rate, return a boolean with those odds
     * can return different values on each call
     */
    public function shouldSpawn(): bool
    {
        // spawnRate is between 0 and 1 - 1 = always spawn
        if ($this->spawnRate === 0) {
            return false; // never spawn for 0, so get out early
        }

        // generate a random number between 0 and 100 then get it between 0 and 1
        $rand = mt_rand(0, 100) / 100;

        // will spawn  only if the rand number was below the spawn threshold
        return ($rand <= $this->spawnRate);
    }

    public function jsonSerialize()
    {
        $data = [
            'id' => $this->id,
            'name' => $this->getName(),
            'description' => $this->getDescription(),
            'imageKey' => $this->getImageKey(),
        ];

        if ($this->uniqueKey) {
            $data['uniqueKey'] = $this->getUniqueKey();
        }

        return $data;
    }
}
