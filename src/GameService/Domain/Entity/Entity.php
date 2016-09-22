<?php

namespace GameService\Domain\Entity;

/**
 * Class Entity
 * For those which the base object inherit
 */
abstract class Entity
{
    protected $id;

    public function __construct(
        int $id
    ) {
        $this->id = $id;
    }


    public function getId(): int
    {
        return $this->id;
    }
}
