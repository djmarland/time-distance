<?php

namespace GameService\Domain\ValueObject;

use GameService\Domain\Exception\InvalidNicknameException;

class Nickname implements \JsonSerializable
{
    private $nickname;

    public function __construct(
        string $nickname
    ) {
        $nickname = static::validate($nickname);
        $this->nickname = $nickname;
    }

    public static function validate(string $nickname): string
    {
        $nickname = strtolower($nickname);
        if (!preg_match('/[a-z0-9]{1,30}/i', $nickname)) {
            throw new InvalidNicknameException(
                'Nickname can only use letters, numbers, and dashes; between 1 and 30 characters'
            );
        }
        return $nickname;
    }

    public function getValue(): string
    {
        return $this->nickname;
    }

    public function __toString()
    {
        return $this->getValue();
    }

    public function jsonSerialize()
    {
        return $this->__toString();
    }

}
