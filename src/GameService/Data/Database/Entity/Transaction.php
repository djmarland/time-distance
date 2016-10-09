<?php
namespace GameService\Data\Database\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Table(name="transactions")})
 */
class Transaction extends Entity
{
    /** @ORM\Column(type="string") */
    private $type;

    /** @ORM\Column(type="integer") */
    private $amount;

    /**
     * @ORM\ManyToOne(targetEntity="Player")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $player;

    /**
     * @ORM\ManyToOne(targetEntity="Hub")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $hub;

    public function __construct(
        Player $player,
        Hub $hub,
        string $type,
        int $amount
    ) {
        $this->player = $player;
        $this->hub = $hub;
        $this->type = $type;
        $this->amount = $amount;
    }

    /** Getters/Setters */
    public function getPlayer(): Player
    {
        return $this->player;
    }

    public function getHub(): Hub
    {
        return $this->hub;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getAmount(): int
    {
        return $this->amount;
    }
}
