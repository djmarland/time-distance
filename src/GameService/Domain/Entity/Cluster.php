<?php

namespace GameService\Domain\Entity;

class Cluster extends Entity implements \JsonSerializable
{
    private $name;

    public function __construct(
        int $id,
        string $name
    ) {
        parent::__construct($id);

        $this->name = $name;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function jsonSerialize()
    {
        return [
            'name' => $this->getName(),
        ];
    }
}
