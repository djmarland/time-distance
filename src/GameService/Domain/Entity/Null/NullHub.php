<?php

namespace GameService\Domain\Entity\Null;

use GameService\Domain\Entity\Hub;

class NullHub extends Hub
{
    public function __construct() {
        parent::__construct(
            0,
            '',
            '',
            0,
            0,
            false
        );
    }
}
