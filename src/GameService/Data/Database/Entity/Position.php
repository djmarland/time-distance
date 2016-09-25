<?php
namespace GameService\Data\Database\Entity;

use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use InvalidArgumentException;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Table(name="positions",indexes={
 *     @ORM\Index(name="position_player_idx", columns={"player_id"}),
 *     @ORM\Index(name="position_hub_idx", columns={"hub_id"}),
 *     @ORM\Index(name="position_completed_time_idx", columns={"completed_time"}),
 *     @ORM\Index(name="position_player_completed_time_idx", columns={"player_id","completed_time"}),
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
        DateTimeInterface $startTime,
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
    public function getStartTime(): DateTimeInterface
    {
        return $this->startTime;
    }

    public function setEndTime(DateTimeInterface $endTime)
    {
        return $this->endTime = $endTime;
    }

    /**
     * @return DateTimeInterface|null
     */
    public function getEndTime()
    {
        return $this->endTime;
    }

    public function setCompletedTime(DateTimeInterface $completedTime)
    {
        return $this->completedTime = $completedTime;
    }

    /**
     * @return DateTimeInterface|null
     */
    public function getCompletedTime()
    {
        return $this->completedTime;
    }

    public function setLastPointsCalculationTime(DateTimeInterface $time)
    {
        return $this->time = $time;
    }

    /**
     * @return DateTimeInterface|null
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
