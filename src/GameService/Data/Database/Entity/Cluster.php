<?php
namespace GameService\Data\Database\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Table(name="clusters")})
 */
class Cluster extends Entity
{
    /** @ORM\Column(type="string") */
    private $name;

    public function __construct(
        string $name
    ) {
        $this->name = $name;
    }

    /** Getters/Setters */
    public function getName(): string
    {
        return $this->name;
    }
}
