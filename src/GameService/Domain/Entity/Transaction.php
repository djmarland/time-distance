<?php

namespace GameService\Domain\Entity;

class Transaction extends Entity implements \JsonSerializable
{
    const TYPE_ATTACK = 'attack';
    const TYPE_REINFORCE = 'reinforce';
    const TYPE_WITHDRAWAL = 'withdrawal';
    const TYPE_PURCHASE = 'purchase';
    const TYPE_EVICT = 'evict';

    private $hub;
    private $player;
    private $type;
    private $cost;

    public static function getConflictTypes(): array
    {
        return [
            self::TYPE_ATTACK,
            self::TYPE_EVICT,
            self::TYPE_PURCHASE,
        ];
    }

    public function __construct(
        int $id,
        Hub $hub,
        Player $player,
        string $type,
        int $cost
    ) {
        parent::__construct($id);

        $this->hub = $hub;
        $this->player = $player;
        $this->type = $type;
        $this->cost = $cost;
    }

    public function getHub(): Hub
    {
        return $this->hub;
    }

    public function getPlayer(): Player
    {
        return $this->player;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getCost(): int
    {
        return $this->cost;
    }

    public function getText(): string {
        // todo - temporary. be more interesting (and allow links)

        $hubName = $this->getHub()->getName();
        $clusterName = $this->getHub()->getClusterName();
        $playerName = $this->getPlayer()->getNickname();
        $hubFull = $hubName . ' (' . $clusterName . ')';

        switch ($this->getType()) {
            case self::TYPE_ATTACK:
                return $playerName . ' attacked ' . $hubFull;
            case self::TYPE_PURCHASE:
                return $playerName . ' took ownership of ' . $hubFull;
            case self::TYPE_EVICT:
                return $playerName . ' performed an eviction of ' . $hubFull;
            case self::TYPE_REINFORCE:
                return $playerName . ' reinforced ' . $hubFull;
            case self::TYPE_WITHDRAWAL:
                return $playerName . ' weakened ' . $hubFull . ' via withdrawal';
        }
        throw new \InvalidArgumentException('A bad type was provided. How did we get here?');
    }

    public function jsonSerialize()
    {
        return [

        ];
    }
}
