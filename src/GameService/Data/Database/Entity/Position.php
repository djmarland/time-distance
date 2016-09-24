<?php
namespace GameService\Data\Database\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use InvalidArgumentException;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Table(name="positions",indexes={
 *     @ORM\Index(name="position_player_idx", columns={"player_id"}),
 *     @ORM\Index(name="position_hub_idx", columns={"hub_id"}),
 * })
 */
class Position extends Entity
{
    /** @ORM\Column(type="datetime") */
    private $startTime;

    /** @ORM\Column(type="datetime", nullable=true) */
    private $endTime;

    /** @ORM\Column(type="datetime", nullable=true) */
    private $completedTime; // only used for queries to filter old rows

    /** @ORM\Column(type="datetime", nullable=true) */
    private $lastPointsCalculationTime;

    /** @ORM\Column(type="boolean") */
    private $reverseDirection = false;

    /**
     * @ORM\ManyToOne(targetEntity="Player")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $player;

    /**
     * @ORM\ManyToOne(targetEntity="Hub")
     * @ORM\JoinColumn(nullable=true, onDelete="SET NULL")
     */
    private $hub;

    /**
     * @ORM\ManyToOne(targetEntity="Spoke")
     * @ORM\JoinColumn(nullable=true, onDelete="SET NULL")
     */
    private $spoke;

    public function __construct(
        Player $player,
        DateTimeImmutable $startTime,
        $locationEntity
    ) {
        if ($locationEntity instanceof Hub) {
            $this->hub = $locationEntity;
        } elseif ($locationEntity instanceof Spoke) {
            $this->spoke = $locationEntity;
        } else {
            throw new InvalidArgumentException('Position must have a location entity: Hub or Spoke');
        }

        $this->player = $player;
        $this->startTime = $startTime;
    }

    /** Getters/Setters */
    public function getStartTime(): DateTimeImmutable
    {
        return $this->startTime;
    }

    public function setEndTime(DateTimeImmutable $endTime)
    {
        return $this->endTime = $endTime;
    }

    /**
     * @return DateTimeImmutable|null
     */
    public function getEndTime()
    {
        return $this->endTime;
    }

    public function setCompletedTime(DateTimeImmutable $completedTime)
    {
        return $this->completedTime = $completedTime;
    }

    /**
     * @return DateTimeImmutable|null
     */
    public function getCompletedTime()
    {
        return $this->completedTime;
    }

    public function setLastPointsCalculationTime(DateTimeImmutable $time)
    {
        return $this->time = $time;
    }

    /**
     * @return DateTimeImmutable|null
     */
    public function getLastPointsCalculationTime()
    {
        return $this->lastPointsCalculationTime;
    }

    public function getPlayer(): Player
    {
        return $this->player;
    }

    public function getReverseDirection()
    {
        return $this->reverseDirection;
    }

    public function setReverseDirection(bool $reverseDirection)
    {
        return $this->reverseDirection = $reverseDirection;
    }

    /**
     * @return Hub|null
     */
    public function getHub()
    {
        return $this->hub;
    }

    /**
     * @return Spoke|null
     */
    public function getSpoke()
    {
        return $this->spoke;
    }
}
