<?php
namespace GameService\Data\Database\Entity;

use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Table(name="players",indexes={@ORM\Index(name="player_nickname_idx", columns={"nickname"})})
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

    /**
     * @ORM\ManyToOne(targetEntity="Hub")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $homeHub;

//    private $clan;

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

    public function setHomeHub(Hub $hub)
    {
        return $this->homeHub = $hub;
    }

    public function getHomeHub(): Hub
    {
        return $this->homeHub;
    }
}
