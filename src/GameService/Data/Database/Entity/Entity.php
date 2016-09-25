<?php
namespace GameService\Data\Database\Entity;

use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use DateTimeImmutable;

abstract class Entity
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /** @ORM\Column(type="datetime", nullable=false) */
    protected $createdAt;

    /** @ORM\Column(type="datetime", nullable=false) */
    protected $updatedAt;


    /** Getters/Setters */
    public function getId(): int
    {
        return (int) $this->id;
    }

    public function getCreatedAt(): DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): DateTimeInterface
    {
        return $this->updatedAt;
    }

    /**
     * Set createdAt
     *
     * @ORM\PrePersist
     */
    public function onCreate()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->updatedAt = new DateTimeImmutable();
    }

    /**
     * Set updatedAt
     *
     * @ORM\PreUpdate
     */
    public function onUpdate()
    {
        $this->updatedAt = new DateTimeImmutable();
    }
}
