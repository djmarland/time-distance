<?php

namespace GameService\Domain\ValueObject\Null;

use GameService\Domain\ValueObject\Nickname;

class NullNickname extends Nickname implements \JsonSerializable
{
    public function __construct() {
        parent::__construct('');
    }

    public static function validate(string $nickname): string
    {
        return $nickname;
    }

    public function jsonSerialize()
    {
        return null;
    }
}
