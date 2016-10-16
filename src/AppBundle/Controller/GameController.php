<?php

namespace AppBundle\Controller;

use GameService\Domain\Entity\Ability;
use GameService\Domain\Entity\Hub;
use GameService\Domain\Entity\Map;
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
        $this->setPlayerPosition($this->getPlayer());
        return $this->renderTemplate('game:play');
    }

    public function arrivalAction()
    {
        // todo - this is temporary. find a better way

        // set where the player is
        $this->setPlayerPosition($this->getPlayer());
        return $this->renderStatus();
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
            // reverse any rotation
            $bearing = Bearing::getRotatedBearing($bearing, -$player->getMapRotationSteps());
            $bearing = new Bearing($bearing, $player->getMapRotationSteps());
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

    public function takeHubAction()
    {
        $player = $this->getPlayer();
        $cost = $this->getParameter('original_purchase_cost');

        // get the current players position
        $position = $this->get('app.services.positions')->findFullCurrentPositionForPlayer($player);

        // only valid if in a hub
        if (!$position->isInHub()) {
            throw new HttpException(400, 'Invalid move (you are not in a hub). No cheating!');
        }

        $hub = $position->getLocation();
        // only valid if not a haven
        if ($hub->isHaven()) {
            throw new HttpException(400, 'Invalid move (this is a haven). No cheating!');
        }

        // only possible if the hub isn't already owned
        $owner = $hub->getOwner();
        if ($owner) {
            throw new HttpException(400, 'Invalid move (hub already owned). No cheating!');
        }

        // only possible if the player has the original purchase cost available
        if ($player->getPoints() < $cost) {
            throw new HttpException(400, 'Invalid move (not enough points to do this). No cheating!');
        }

        // now we are ready to take ownership
        $this->get('app.services.hubs')->takeOwnership($position->getLocation(), $player, $cost);

        return $this->renderStatus();
    }

    public function statusAction()
    {
        return $this->renderStatus();
    }

    private function setPlayerPosition(Player $player)
    {
        // todo - safety checks to ensure this can only be done one at a time per player
        $position = $this->get('app.services.positions')->findFullCurrentPositionForPlayer($player);

        if (!$position->isInHub()) {
            // check if the player should be moved into a hub
            if ($position->getExitTime() <= $this->get('app.time_provider')) {
                $hub = $position->getLocation()->getDestinationHubFromDirection($position->isReverseDirection());

                $this->get('app.services.players')->movePlayerToHub($player, $hub);

                // randomly assign some abilities to this hub
                // todo - this action should happen via a different trigger (as it is not in a transaction)
                $this->spawnAbilitiesInHub($hub);
            }
        }
    }

    private function spawnAbilitiesInHub(Hub $hub)
    {
        $abilities = $this->get('app.services.abilities')->findAll();
        // which abilities should be chosen
        $chosenAbilities = array_filter($abilities, function($ability) {
            /** @var Ability $ability */
            return $ability->shouldSpawn();
        });
        $this->get('app.services.hubs')->addAbilities($hub, $chosenAbilities);
    }

    private function renderStatus()
    {
        $player = $this->getPlayer();
        $position = $this->get('app.services.positions')->findFullCurrentPositionForPlayer($player);
        $visibilityWindow = $this->getParameter('visibility_window');

        $this->toView(
            'gameSettings', [
                'currentTime' => $this->get('app.time_provider')->format('c'),
                'distanceMultiplier' => $this->getParameter('distance_multiplier'),
                'visibilityWindow' => $visibilityWindow,
                'originalPurchaseCost' => $this->getParameter('original_purchase_cost'),
            ],
            true
        );

        $directions = $this->getDirections($position);
        if ($directions) {
            $directions = Bearing::rotateIndexedArray($directions, $player->getMapRotationSteps());
        }

        $map = new Map($position, $directions, [], $visibilityWindow);

        $this->toView('player', $player, true);
        $this->toView('map', $map, true);
        $this->toView('position', $position, true);

        // get the abilities (and check against the player)
        $abilities = $this->get('app.services.abilities')->findAll();

        $playersPresent = [];
        $abilitiesPresent = [];
        if ($position->isInHub()) {
            $playersPresent = $this->get('app.services.players')
                ->findInHub($position->getLocation());

            // find abilities in the hub
            foreach($position->getLocation()->getPresentAbilityIds() as $id) {
                foreach ($abilities as $ability) {
                    if ($ability->getId() == $id) {
                        $abilitiesPresent[] = $ability;
                    }
                }
            }
        }

        $this->toView('playersPresent', $playersPresent, true);
        $this->toView('abilitiesPresent', $abilitiesPresent, true);

        // sort the abilities into type groups
        // and hide them if they are mystery and this player has not seen them
        $abilityGroups = [];
        $currentGroupKey = null;
        $currentGroup = [];
        foreach ($abilities as $ability) {
            /** @var Ability $ability */
            $typeKey = $ability->getType();
            if ($currentGroupKey != $typeKey) {
                if (!is_null($currentGroupKey)) {
                    $abilityGroups[] = $currentGroup;
                }
                $currentGroup = [];
                $currentGroup['title'] = $typeKey;
                $currentGroup['items'] = [];
                $currentGroupKey = $typeKey;
            }
            if ($ability->isMystery()
                // todo (&& player has not already seen it)
            ) {
                $currentGroup['items'][] = [
                    'mystery' => true
                ];
            } else {
                $currentGroup['items'][] = [
                    'mystery' => false,
                    'ability' => $ability,
                    'count' => mt_rand(0,4), // todo - actual count from player
                ];
            }
        }
        if (!empty($currentGroup)) {
            $abilityGroups[] = $currentGroup;
        }

        // remove any groups where all items within it are mystery (likely only the disputed group)
        $abilityGroups = array_filter($abilityGroups, function($group) {
            foreach ($group['items'] as $item) {
                if ($item['mystery'] === false) {
                    return true;
                }
            }
            return false;
        });

        $this->toView('abilities', $abilityGroups, true);

        return $this->renderJSON();
    }

    private function getPlayer(): Player
    {
        $nickname = 'e7400f94';
        // @todo - fetch by cookie token
        try {
            return $this->get('app.services.players')
                ->findByNickname($nickname);
        } catch (EntityNotFoundException $e) {
            // player was not found. Invalid request.
            throw new HttpException(400, 'Invalid request. No player data');
        }
    }

    private function getDirections(Position $position): array
    {
        if (!$position->isInHub()) {
            return [];
        }
        $hub = $position->getLocation();

        $spokes = $this->get('app.services.spokes')
            ->findForHubDetailed($hub);

        // unpack the spokes into a list of directions
        $directions = Bearing::getEmptyBearingsList();

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
