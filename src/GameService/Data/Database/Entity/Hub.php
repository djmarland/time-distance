<?php
namespace GameService\Data\Database\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Table(name="hubs",indexes={@ORM\Index(name="hub_urlkey_idx", columns={"url_key"})})
 */
class Hub extends Entity
{
    /** @ORM\Column(type="string") */
    private $name;

    /** @ORM\Column(type="string") */
    private $urlKey;

    /** @ORM\Column(type="integer") */
    private $xCoordinate;

    /** @ORM\Column(type="integer") */
    private $yCoordinate;

    /** @ORM\Column(type="boolean") */
    private $isHaven = false;

    /**
     * @ORM\ManyToOne(targetEntity="Cluster")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $cluster;

    public function __construct(
        string $name,
        string $urlKey,
        int $xCoordinate,
        int $yCoordinate,
        Cluster $cluster
    ) {
        $this->name = $name;
        $this->urlKey = $urlKey;
        $this->xCoordinate = $xCoordinate;
        $this->yCoordinate = $yCoordinate;
    }

    /** Getters/Setters */
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

    public function getCluster(): Cluster
    {
        return $this->cluster;
    }

    public function setIsHaven(bool $isHaven)
    {
        return $this->isHaven = $isHaven;
    }

    public function getIsHaven(): bool
    {
        return $this->isHaven;
    }
}
