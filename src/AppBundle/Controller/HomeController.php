<?php

namespace AppBundle\Controller;

class HomeController extends Controller
{
    public function indexAction()
    {
        $this->view->setFullTitle(
            'Time & Distance'
        );

        $this->cacheTime = 3600;
        $this->toView('allowRedirect', $this->request->get('allowRedirect'));

        return $this->renderTemplate('home:index');
    }

    public function statsAction()
    {
        $playersService = $this->get('app.services.players');

        $players = $playersService->countAll();
        $playersInHub = $playersService->countThoseInHubs();
        $playersTravelling = $playersService->countThoseTravelling();
        $playersSafe = $playersService->countThoseInHavenHubs();

        $this->toView('stats', [
            'players' => $players,
            'totalPoints' => $playersService->totalPoints(),
            'pointsRate' => round($playersService->overallPointRate(), 3),
            'inHubsPercent' => round(($playersInHub / $players) * 100, 2),
            'travellingPercent' => round(($playersTravelling / $players) * 100, 2),
            'safePercent' => round(($playersSafe / $players) * 100, 2),
        ]);
        return $this->renderTemplate('home:stats');
    }
}
