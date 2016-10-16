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

    /** @ORM\Column(type="integer", nullable=true) */
    private $protectionScore;

    /** @ORM\Column(type="array", nullable=true) */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="Cluster")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $cluster;

    /**
     * @ORM\ManyToOne(targetEntity="Player")
     * @ORM\JoinColumn(onDelete="SET NULL", nullable=true)
     */
    private $owner;

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

    public function getOwner()
    {
        return $this->owner;
    }

    public function setOwner(Player $owner = null)
    {
        $this->owner = $owner;
    }

    public function getProtectionScore()
    {
        return $this->protectionScore;
    }

    public function setProtectionScore(int $score = null)
    {
        $this->protectionScore = $score;
    }

    public function getStatus()
    {
        return $this->status;
    }

    public function setStatus(array $status = null)
    {
        $this->status = $status;
    }
}
