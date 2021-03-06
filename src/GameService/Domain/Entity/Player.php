<?php

namespace GameService\Domain\Entity;

use DateTimeImmutable;
use GameService\Domain\Exception\DataNotFetchedException;
use GameService\Domain\ValueObject\Nickname;

class Player extends Entity implements \JsonSerializable
{
    private $nickname;
    private $points;
    private $pointsRate;
    private $pointsCalculationTime;
    private $homeHub;
    private $abilityCounts;

    public function __construct(
        int $id,
        Nickname $nickname,
        float $points,
        float $pointsRate,
        DateTimeImmutable $pointsCalculationTime,
        array $abilityCounts,
        Hub $homeHub = null
    ) {
        parent::__construct($id);

        $this->nickname = $nickname;
        $this->points = $points;
        $this->pointsRate = $pointsRate;
        $this->pointsCalculationTime = $pointsCalculationTime;
        $this->abilityCounts = $abilityCounts;
        $this->homeHub = $homeHub;
    }

    public function getNickname(): Nickname
    {
        return $this->nickname;
    }

    public function getPoints(): float
    {
        return $this->points;
    }

    public function getPointsRate(): float
    {
        return $this->pointsRate;
    }

    public function getPointsCalculationTime(): DateTimeImmutable
    {
        return $this->pointsCalculationTime;
    }

    public function getHomeHub(): Hub
    {
        if (is_null($this->homeHub)) {
            throw new DataNotFetchedException('Tried to fetch home hub but the data was not available');
        }
        return $this->homeHub;
    }

    public function getUrl(): string
    {
        return '/players/' . (string) $this->getNickname();
    }

    public function getPointsEstimate(): float
    {
        $now = new DateTimeImmutable(); // todo - inject this somehow?
        $diff = $now->format('U') - $this->pointsCalculationTime->format('U');

        return $this->getPoints() + ($diff * $this->getPointsRate());
    }

    public function getPointsEstimateString(): string
    {
        $points = $this->getPointsEstimate();
        return number_format($points);
    }

    public function hasSeenAbility(Ability $ability): bool
    {
        return isset($this->abilityCounts[$ability->getId()]);
    }

    public function getAbilityCount(Ability $ability): int
    {
        return $this->abilityCounts[$ability->getId()] ?? 0;
    }

    public function getMapRotationSteps(): int
    {
        return 0; // no rotation at this stage
        return $this->getId() % 6;
    }

    public function jsonSerialize()
    {
        return [
            'nickname' => $this->getNickname(),
            'url' => $this->getUrl(),
            'points' => $this->getPoints(),
            'pointsRate' => $this->getPointsRate(),
            'pointsCalculationTime' => $this->getPointsCalculationTime()->format('c'),
            'pointsEstimate' => $this->getPointsEstimate()
        ];
    }
}
