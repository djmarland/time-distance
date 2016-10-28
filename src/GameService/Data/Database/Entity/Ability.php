<?php
namespace GameService\Data\Database\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Table(name="abilities")})
 */
class Ability extends Entity
{
    /** @ORM\Column(type="string") */
    private $name;

    /** @ORM\Column(type="string") */
    private $imageKey;

    /** @ORM\Column(type="string") */
    private $type;

    /** @ORM\Column(type="string") */
    private $class;

    /** @ORM\Column(type="float") */
    private $spawnRate = 0;

    /** @ORM\Column(type="string") */
    private $description = '';

    /** @ORM\Column(type="integer") */
    private $sortOrder = 0;

    /** @ORM\Column(type="boolean") */
    private $isMystery = false;

    public function __construct(
        string $name,
        string $imageKey,
        string $type,
        string $class
    ) {
        $this->name = $name;
        $this->imageKey = $imageKey;
        $this->type = $type;
        $this->class = $class;
    }

    /** Getters/Setters */
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

    public function getClass(): string
    {
        return $this->class;
    }

    public function getSpawnRate(): float
    {
        return $this->spawnRate;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getSortOrder(): int
    {
        return $this->sortOrder;
    }

    public function getIsMystery(): bool
    {
        return $this->isMystery;
    }
}
