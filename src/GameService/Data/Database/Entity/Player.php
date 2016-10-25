<?php
namespace GameService\Data\Database\Entity;

use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use GameService\Data\Database\Entity\Status\PlayerStatus;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Table(name="players",indexes={
 *     @ORM\Index(name="player_nickname_idx", columns={"nickname"}),
 *     @ORM\Index(name="player_time_of_death_idx", columns={"time_of_death"}),
 * })
 * @ORM\Entity(repositoryClass="GameService\Data\Database\EntityRepository\PlayerRepository")
 */
class Player extends Entity
{
    /** @ORM\Column(type="string", unique=true) */
    private $nickname;

    /** @ORM\Column(type="float") */
    private $points = 0;

    /** @ORM\Column(type="float") */
    private $pointsRate = 0;

    /** @ORM\Column(type="datetime") */
    private $pointsCalculationTime;

    /** @ORM\Column(type="datetime", nullable=true) */
    private $timeOfDeath;

    /**
     * @ORM\ManyToOne(targetEntity="Hub")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $homeHub;

//    private $clan;

    /** @ORM\Column(type="text", nullable=true) */
    private $status;

    private $_statusObject;

    public function __construct(
        string $nickname,
        float $points,
        float $pointsRate,
        DateTimeInterface $pointsCalculationTime,
        Hub $homehub
    ) {
        $this->nickname = $nickname;
        $this->points = $points;
        $this->pointsRate = $pointsRate;
        $this->pointsCalculationTime = $pointsCalculationTime;
        $this->homeHub = $homehub;
    }

    /** Getters/Setters */
    public function getNickname(): string
    {
        return $this->nickname;
    }

    public function setPoints(float $points)
    {
        $this->points = $points;
    }

    public function getPoints(): float
    {
        return $this->points;
    }

    public function setPointsRate(float $pointsRate)
    {
        $this->pointsRate = $pointsRate;
    }

    public function getPointsRate(): float
    {
        return $this->pointsRate;
    }

    public function setPointsCalculationTime(DateTimeInterface $pointsCalculationTime)
    {
        $this->pointsCalculationTime = $pointsCalculationTime;
    }

    public function getPointsCalculationTime(): DateTimeInterface
    {
        return $this->pointsCalculationTime;
    }

    public function setTimeOfDeath(DateTimeInterface $timeOfDeath = null)
    {
        $this->timeOfDeath = $timeOfDeath;
    }

    public function getTimeOfDeath()
    {
        return $this->timeOfDeath;
    }

    public function setHomeHub(Hub $hub)
    {
        return $this->homeHub = $hub;
    }

    public function getHomeHub(): Hub
    {
        return $this->homeHub;
    }

    public function deductPoints(int $points)
    {
        $this->points = $this->points - $points;
    }

    public function addPoints(int $points)
    {
        $this->points = $this->points + $points;
    }

    public function getStatus()
    {
        if (!$this->_statusObject) {
            $this->_statusObject = new PlayerStatus($this->status);
        }
        return $this->_statusObject;
    }

    public function setStatus(PlayerStatus $status = null)
    {
        $this->_statusObject = $status;
        $this->status = (string) $this->_statusObject;
    }
}
