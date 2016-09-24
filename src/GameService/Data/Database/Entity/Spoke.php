<?php
namespace GameService\Data\Database\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Table(name="spokes",indexes={
 *     @ORM\Index(name="spoke_start_idx", columns={"start_hub_id"}),
 *     @ORM\Index(name="spoke_end_idx", columns={"end_hub_id"}),
 * })})
 */
class Spoke extends Entity
{

    /**
     * @ORM\ManyToOne(targetEntity="Hub")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $startHub;

    /**
     * @ORM\ManyToOne(targetEntity="Hub")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $endHub;

    /** @ORM\Column(type="string") */
    private $bearing;

    /** @ORM\Column(type="integer") */
    private $distance;

    /** @ORM\Column(type="json_array", nullable=true) */
    private $status;

    public function __construct(
        Hub $startHub,
        Hub $endHub,
        string $bearing,
        int $distance
    ) {
        $this->startHub = $startHub;
        $this->endHub = $endHub;
        $this->bearing = $bearing;
        $this->distance = $distance;
    }

    /** Getters/Setters */
    public function getStartHub(): Hub
    {
        return $this->startHub;
    }

    public function getEndHub(): Hub
    {
        return $this->endHub;
    }

    public function getBearing(): string
    {
        return $this->bearing;
    }

    public function getDistance(): int
    {
        return $this->distance;
    }

    public function setStatus($status)
    {
        $this->status = $status;
    }

    public function getStatus()
    {
        return $this->status;
    }
}
