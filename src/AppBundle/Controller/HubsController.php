<?php

namespace AppBundle\Controller;

use GameService\Domain\Entity\Hub;
use GameService\Domain\Exception\EntityNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class HubsController extends Controller
{
    public function listAction()
    {
        $hubs = $this->get('app.services.hubs')
            ->findAllInCoordinates();

        $largestX = 0;
        $largestY = 0;

        foreach($hubs as $x => $row) {
            if ($x > $largestX) {
                $largestX = $x;
            }
            foreach (array_keys($row) as $y) {
                if ($y > $largestY) {
                    $largestY = $y;
                }
            }
        }

        $coords = [];
        foreach (range(1, $largestY) as $y) {
            if (!isset($hubs[$y])) {
                $coords[$y] = [];
            }
            foreach (range(1, $largestX) as $x) {
                $coords[$y][$x] = $hubs[$x][$y] ?? null;
            }
        }
        $this->toView('coords', $coords);

        return $this->renderTemplate('hubs:list', 'Hubs');
    }

    public function showAction()
    {
        $hub = $this->getHub();

        $players = $this->get('app.services.players')
            ->findInHub($hub);

        $this->toView('playersPresent', !!count($players));
        $this->toView('players', $players, true);
        $this->toView('playersData', json_encode($players));

        return $this->renderTemplate('hubs:show', $hub->getName());
    }

    private function getHub(): Hub
    {
        $urlKey = $this->request->get('urlKey');
        try {
            $hub = $this->get('app.services.hubs')
                ->findByUrlKey($urlKey);
        } catch (EntityNotFoundException $e) {
            throw new HttpException(404, 'Hub ' . $urlKey . ' does not exist.');
        }

        $this->toView('hub', $hub, true);
        return $hub;
    }

}
