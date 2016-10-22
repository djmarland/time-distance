<?php

namespace GameService\Domain\Entity\Null;

use GameService\Domain\Entity\Player;
use GameService\Domain\ValueObject\Null\NullNickname;

class NullPlayer extends Player
{
    public function __construct()
    {
        parent::__construct(
            0,
            new NullNickname(),
            0,
            0,
            new \DateTimeImmutable(),
            [],
            new NullHub()
        );
    }
}
