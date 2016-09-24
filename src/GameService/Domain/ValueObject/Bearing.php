<?php

namespace GameService\Domain\ValueObject;

use GameService\Domain\Exception\InvalidBearingException;

class Bearing implements \JsonSerializable
{
    const BEARINGS = [
        'nw' => 'se',
        'ne' => 'sw',
        'e' => 'w',
        'se' => 'nw',
        'sw' => 'ne',
        'w' => 'e',
    ];

    private $bearing;

    public function __construct(
        string $bearing
    ) {
        $bearing = self::validate($bearing);
        $this->bearing = $bearing;
    }

    public static function validate(string $bearing): string
    {
        $bearing = strtolower($bearing);
        if (!in_array($bearing, self::BEARINGS)) {
            throw new InvalidBearingException('Not a valid bearing (' . $bearing . ')');
        }
        return $bearing;
    }

    public function getOpposite()
    {
        return new Bearing(self::BEARINGS[$this->bearing]);
    }

    public function getValue(): string
    {
        return $this->bearing;
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
