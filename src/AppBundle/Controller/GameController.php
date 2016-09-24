<?php

namespace AppBundle\Controller;

use GameService\Domain\Entity\Player;
use GameService\Domain\Entity\Position;
use GameService\Domain\Entity\Spoke;
use GameService\Domain\Exception\EntityNotFoundException;
use GameService\Domain\Exception\InvalidBearingException;
use GameService\Domain\Exception\InvalidNicknameException;
use GameService\Domain\ValueObject\Bearing;
use Symfony\Component\HttpKernel\Exception\HttpException;

class GameController extends Controller
{
    protected $cacheTime = null; // game screens are not cachable

    public function playAction()
    {
        return $this->renderTemplate('game:play');
    }

    public function newPlayerAction()
    {
        // eventually this action should come via a POST and be using OAUTH stuff

        $nickname = substr(md5(time()),0,8);

        // todo - check the user doesn't already exist

        try {
            $player = $this->get('app.services.players')
                ->newPlayer($nickname);
        } catch (InvalidNicknameException $e) {
            // todo - return the validation response as parsable JSON
            throw new HttpException(400, $e->getMessage());
        }

        return $this->statusAction();
    }

    public function makeMoveAction()
    {
        $player = $this->getPlayer();

        // get the bearing supplied
        $bearing = $this->request->getContent();
        try {
            $bearing = new Bearing($bearing);
        } catch (InvalidBearingException $e) {
            throw new HttpException(400, 'Invalid direction provided');
        }

        // get the players current position
        $position = $this->get('app.services.positions')->findFullCurrentPositionForPlayer($player);

        if (!$position->isInHub()) {
            throw new HttpException(400, 'Not in a valid state to perform move');
        }

        $currentHub = $position->getLocation();

        // check the bearing was valid, by fetching all of the directions available
        $spokes = $this->get('app.services.spokes')
            ->findForHubDetailed($currentHub);

        // find the requested spoke in the preferred direction
        $chosenSpoke = null;
        foreach ($spokes as $spoke) {
            /** @var Spoke $spoke */
            if ($spoke->getRelativeBearing($currentHub) == $bearing) {
                $chosenSpoke = $spoke;
                break;
            }
        }

        // if we didn't find it, this is an invalid move
        if (!$chosenSpoke) {
            throw new HttpException(400, 'Invalid move. No cheating!');
        }

        // calculate spoke direction, and completion time
        $reverseDirection = $chosenSpoke->isReverseDirection($currentHub);

        // todo - this should probably be abstracted somewhere
        $now = $this->get('app.time_provider');
        $distanceMultiplier = $this->getParameter('distance_multiplier');
        $distance = $chosenSpoke->getDistance();

        $secondsToAdd = floor($distanceMultiplier / 60); // 1/60 of multiplier by default if distance = 0
        $secondsToAdd = min($secondsToAdd, 1);
        if ($distance) {
            $secondsToAdd = $distance * $distanceMultiplier;
        }

        $endTime = $now->add(new \DateInterval('PT' . $secondsToAdd . 'S'));

        $this->get('app.services.players')->movePlayerToSpoke(
            $player,
            $chosenSpoke,
            $endTime,
            $reverseDirection
        );

        return $this->renderStatus();
    }

    public function statusAction()
    {
        $player = $this->getPlayer();
        $position = $this->get('app.services.positions')->findFullCurrentPositionForPlayer($player);

        if (!$position->isInHub()) {
            // check if the player should be moved into a hub
            if ($position->getExitTime() <= $this->get('app.time_provider')) {
                $this->get('app.services.players')->movePlayerToHub(
                    $player,
                    $position->getLocation()->getDestinationHubFromDirection($position->isReverseDirection())
                );
            }
        }

        return $this->renderStatus();
    }

    private function renderStatus()
    {
        $player = $this->getPlayer();
        $position = $this->get('app.services.positions')->findFullCurrentPositionForPlayer($player);

        $this->toView(
            'gameSettings', [
            'currentTime' => $this->get('app.time_provider')->format('c'),
            'distanceMultiplier' => $this->getParameter('distance_multiplier')
        ],
            true
        );
        $this->toView('player', $player, true);
        $this->toView('position', $position, true);
        $this->toView('directions', $this->getDirections($position), true);

        $playersPresent = [];
        if ($position->isInHub()) {
            $playersPresent = $this->get('app.services.players')
                ->findInHub($position->getLocation());
        }

        $this->toView('playersPresent', $playersPresent, true);

        return $this->renderJSON();
    }

    private function getPlayer(): Player
    {
        $nickname = 'djmarland';
        // @todo - fetch by cookie token
        try {
            return $this->get('app.services.players')
                ->findByNickname($nickname);
        } catch (EntityNotFoundException $e) {
            // player was not found. Invalid request.
            throw new HttpException(400, 'Invalid request. No player data');
        }
    }

    private function getDirections(Position $position)
    {
        if (!$position->isInHub()) {
            return null;
        }
        $hub = $position->getLocation();

        $spokes = $this->get('app.services.spokes')
            ->findForHubDetailed($hub);

        // unpack the spokes into a list of directions
        $directions = [
            'nw' => null,
            'ne' => null,
            'e'  => null,
            'se' => null,
            'sw' => null,
            'w'  => null,
        ];

        foreach ($spokes as $spoke) {
            /** @var Spoke $spoke */
            $bearing = (string) $spoke->getRelativeBearing($hub);
            $directions[$bearing] = [
                'bearing' => $bearing,
                'crossesTheVoid' => $spoke->crossesTheVoid(),
                'distance' => $spoke->getDistance(),
                'hub' => $spoke->getDestinationHub($hub)
            ];
        }

        return $directions;
    }
}
