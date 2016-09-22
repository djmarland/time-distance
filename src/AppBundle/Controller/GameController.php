<?php

namespace AppBundle\Controller;


use GameService\Domain\Entity\Hub;
use GameService\Domain\Entity\Player;
use GameService\Domain\Entity\Position;
use GameService\Domain\Exception\EntityNotFoundException;
use GameService\Domain\Exception\InvalidNicknameException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class GameController extends Controller
{
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
        // todo - input should simply be a direction. what that means will be calculated server side from current

        // where are you moving to (currently get the preferred hub key)
        $key = $this->request->query->get('hub-key');

        $this->get('app.services.players')
            ->movePlayerToHub($this->getPlayer(), $key);

        return $this->statusAction();
    }

    public function statusAction()
    {
        $player = $this->getPlayer();

        $position = $this->get('app.services.positions')
            ->findFullCurrentPositionForPlayer($player);

        $data = [];

        $data['currentTime'] = (new \DateTimeImmutable())->format('c');

        $data['currentPosition'] = $this->getCurrentPositon($position);

        $data['player'] = $this->getPlayerInformation($player);

        $data['visibleBoard'] = [
            'rowsCount' => 30,
            'colsCount' => 20,
            'rows' => [
                0 => [
                    0 => null
                ],
                1 => [
                    0 => [
                        'hub' => []
                    ],
                    1 => null,
                    2 => [
                        'spoke' => []
                    ]
                ]
            ]
        ];

        $this->toView('status', $data, true);

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

    private function getCurrentPositon(Position $position)
    {
        // temporary lis until proper spokes and linking
        $temporaryHubsList = $this->get('app.services.hubs')
            ->findAllDetailed();

        $hubs = [];
        foreach($temporaryHubsList as $hub) {
            /** @var Hub $hub */
            if ($hub->getId() != $position->getLocation()->getId()) {
                // don't include the current hub
                $hubs[] = $this->getHubInfo($hub, $position->getLocation());
            }
        }

        return [
            'type' => $position->getLocationType(),
            'arrivalTime' => $position->getArrivalTimeData(),
            'exitTime' => $position->getExitTimeData(),
            'data' => [
                'name' => $position->getLocation()->getName(),
                'owner' => [
                    'name' => 'johnn',
                    'clan' => [
                        'id' => 2342,
                        'name' => 'dada'
                    ]
                ],
                'isHaven' => false,
                'cluster' => [
                    'name' => $position->getLocation()->getClusterName()
                ],
                'paths' => [
                    'nw' => $hubs[0] ?? null,
                    'ne' => $hubs[1] ?? null,
                    'e' => $hubs[2] ?? null,
                    'se' => $hubs[3] ?? null,
                    'sw' => $hubs[4] ?? null,
                    'w' => $hubs[5] ?? null
                ]
            ]
        ];
    }

    private function getHubInfo(Hub $hub, Hub $currentHub)
    {
        $hubCluster = $hub->getCluster();
        $currentCluster = $currentHub->getCluster();
        $crossingTheVoid = ($hubCluster->getId() != $currentCluster->getId());
        $max = $crossingTheVoid ? 24: 5;

        return [
            'hub' => [
                'name' => $hub->getName(),
                'urlKey' => $hub->getUrlKey(),
                'cluster' => $hub->getClusterName()
            ],
            'distance' => mt_rand(0,$max),
            'crossingTheVoid' => $crossingTheVoid,
        ];
    }

    private function getPlayerInformation(Player $player)
    {
        return [
            'name' => $player->getNickname(),
            'points' => $player->getPoints(),
            'pointsTime' => $player->getPointsCalculationTime()->format('c'),
            'pointsRate' => $player->getPointsRate(),
        /*    'clan' => [
                'id' => 1414,
                'name' => 'Super Clan'
            ],
            'hubs' => [
                [
                    'playersPresent' => 4
                ]
            ],
            'abilities' => [

            ], */
        ];
    }
}
