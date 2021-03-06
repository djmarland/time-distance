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

    public static function getEmptyBearingsList(): array
    {
        return array_fill_keys(array_keys(self::BEARINGS), null);
    }

    public static function getRotatedBearing(string $bearing, int $steps): string
    {
        $bearing = self::validate($bearing);
        $bearings = array_keys(self::BEARINGS);
        $key = array_search($bearing, $bearings);
        $newKey = $key + $steps;
        $indexCount = count($bearings);

        while ($newKey < 0) {
            $newKey = $indexCount + $newKey;
        }

        return $bearings[$newKey % $indexCount];
    }

    public static function rotateIndexedArray(array $array, int $steps): array
    {
        // an array exists with indices nw, ne, e etc. Move the values around
        $newArray = $array;
        foreach ($array as $bearing => $data) {
            $newBearing = self::getRotatedBearing($bearing, $steps);
            $newArray[$newBearing] = $data;
            if (isset($newArray[$newBearing]['bearing'])) {
                $newArray[$newBearing]['bearing'] = $newBearing;
            };
        }
        return $newArray;
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
