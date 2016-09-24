<?php

namespace AppBundle\Controller;

use GameService\Domain\Entity\Player;
use GameService\Domain\Exception\EntityNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class PlayersController extends Controller
{
    public function listAction()
    {
        // todo - hide from public
        $players = $this->get('app.services.players')
            ->findAll();

        $this->toView('players', $players);

        return $this->renderTemplate('players:list', 'Players');
    }

    public function showAction()
    {
        $player = $this->getPlayer();

        // current position
        $position = $this->get('app.services.positions')
            ->findFullCurrentPositionForPlayer($player);

        // current clan
        // hubs owned

        $this->toView('position', $position, true);
        $this->toView('feedData', $this->view->getFeedData(true));
        return $this->renderTemplate('players:show', $player->getNickname());
    }

    private function getPlayer(): Player
    {
        $nickname = $this->request->get('nickname');
        try {
            $player = $this->get('app.services.players')
                ->findByNickname($nickname);
        } catch (EntityNotFoundException $e) {
            throw new HttpException(404, 'Player ' . $nickname . ' does not exist.');
        }

        $this->toView('player', $player, true);
        return $player;
    }

}
