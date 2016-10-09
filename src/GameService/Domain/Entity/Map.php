<?php

namespace GameService\Domain\Entity;

use GameService\Domain\Exception\InvalidBearingException;

class Map implements \JsonSerializable
{
    const Y_MULTIPLIERS = [
        'ne' => -1,
        'nw' => -1,
        'se' => 1,
        'sw' => 1,
        'e' => 0,
        'w' => 0
    ];

    private $position;
    private $directions;
    private $nearbyHubs;
    private $visibilityWindow;

    public function __construct(
        Position $position,
        array $directions,
        array $nearbyHubs,
        int $visibilityWindow
    ) {
        $this->position = $position;
        $this->directions = $directions;
        $this->nearbyHubs = $nearbyHubs;
        $this->visibilityWindow = $visibilityWindow;
    }

    public function jsonSerialize()
    {
        // place current position (always 0,0)
        // the view will ensure this is an "even" numbered row
        $currentPosition = $this->getCurrentPosition();

        // place linked hubs (relative to 0,0)
        $linkedHubs = $this->getLinkedHubs();

        // calculate visible spaces
        $visibleSpaces = $this->getVisibleSpaces($linkedHubs);

        // nearby hubs
        $nearbyHubs = $this->getNearbyHubs();

        return [
            'currentMapPosition' => $currentPosition,
            'linkedHubs' => $linkedHubs,
            'nearbyHubs' => $nearbyHubs,
            'visibleSpaces' => $visibleSpaces,
        ];
    }

    private function getCurrentPosition(): array
    {
        // current position is always 0,0
        $position = [
            'x' => 0,
            'y' => 0,
            'position' => $this->position,
        ];
        return $position;
    }

    private function getLinkedHubs(): array
    {
        if (!$this->position->isInHub()) {
            return [];
        }
        $directions = $this->directions;
        $hubs = [];
        foreach ($directions as $direction) {
            if (!$direction) {
                continue;
            }
            $hub = $direction;
            $bearing = $direction['bearing'];
            $distance = $direction['distance'];
            // based on the bearing and distance, calculate the coordinates
            switch($bearing) {
                case 'ne':
                case 'se':
                    $hub['x'] = (($distance - ($distance % 2)) / 2) + 1;
                    break;
                case 'nw':
                case 'sw':
                    $hub['x'] = (($distance + ($distance % 2)) / 2) * -1;
                    break;
                case 'e':
                    $hub['x'] = $distance + 1;
                    break;
                case 'w':
                    $hub['x'] = -($distance + 1);
                    break;
                default:
                    throw new InvalidBearingException($bearing . ' not recognised');
            }
            $hub['y'] = ($distance + 1) * self::Y_MULTIPLIERS[$bearing];

            $hubs[] = $hub;
        }
        return $hubs;
    }

    private function getVisibleSpaces(array $linkedHubs): array
    {
        // all spaces within the visibility window
        $w = $this->visibilityWindow;
        $minY = 0 - $w;
        $maxY = $w;

        $spaces = [];
        for ($y = $minY; $y <= $maxY; $y++) {
            $a = abs($y);
            $r = abs($y % 2);
            $n = ($a + $r) / 2;
            $minX = 0 - ($w - $n);
            $maxX = ($w - $n) + $r;
            for ($x = $minX; $x <= $maxX; $x++) {
                if (!isset($spaces[$y])) {
                    $spaces[$y] = [];
                }
                $spaces[$y][$x] = true;
            }
        }

        // now we have to highlight the paths to the other hubs
        foreach ($linkedHubs as $hub) {
            // work towards zero
            $x = $hub['x'];
            $y = $hub['y'];

            while ($x != 0 || $y != 0) {
                if (!isset($spaces[$y])) {
                    $spaces[$y] = [];
                }
                $spaces[$y][$x] = true;

                // now figure out how to adjust x and y
                if ($y > 0) {
                    $y--;
                } elseif ($y < 0) {
                    $y++;
                }

                // must adjust x after y, as the x calculation relies on the y difference
                if (($y == 0 || $y % 2) && $x < 0) {
                    $x++;
                } elseif (($y == 0 || !($y % 2)) && $x > 0) {
                    $x--;
                }
            }
        }

        return $spaces;
    }

    private function getNearbyHubs(): array
    {

        return [];
    }
}