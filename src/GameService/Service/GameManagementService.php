<?php

namespace GameService\Service;

use Exception;
use GameService\Data\Database\Entity\Player;
use GameService\Data\Database\Entity\Position;
use GameService\Data\Database\EntityRepository\HubRepository;
use GameService\Domain\Game;

class GameManagementService extends Service
{
    use Traits\PlayerScoreTrait;

    public function performPassportControl()
    {
        // find users in a spoke that should have ended
        // positions where spoke ID is not null and the end time is in the past
        $this->logger->info('Finding players that need updating');

        $positions = $this->getQueryBuilder('Position')
            ->select('Position', 'Player', 'Spoke')
            ->join('Position.player', 'Player')
            ->join('Position.spoke', 'Spoke')
            ->andWhere('Position.completedTime IS NULL')
            ->andWhere('Position.endTime <= :now')
            ->orderBy('Position.completedTime', 'ASC') // oldest first
            ->setParameter('now', $this->appTimeProvider)
            ->setMaxResults(100) // only do 100 per run
            ->getQuery()->getResult();

        $total = count($positions);
        $this->logger->info('Positions to update (in this run): ' . $total);
        foreach ($positions as $i => $position) {
            $this->logger->notice('Updating position ' . ($i+1) . '/' . $total);
            $this->passportControlPosition($position);
        }

        $this->entityManager->clear();
        $this->logger->notice('All updated');
    }

    public function performReaping()
    {
        // find users who need to die. Set their score to zero and move them to their home hub
        $this->logger->info('Finding players that died');

        $deadPlayers = $this->entityManager->getRepository('GameService:Player')
            ->findDeadPlayers($this->appTimeProvider);

        $total = count($deadPlayers);
        $this->logger->info('Players to reap (in this run): ' . $total);
        foreach ($deadPlayers as $i => $player) {
            $this->logger->notice('Reaping player ' . ($i+1) . '/' . $total . ' - ' . $player->getNickname());
            $this->reapPlayer($player);
        }

        $this->entityManager->clear();
        $this->logger->notice('All updated');
    }

    public function performSanta()
    {
        // drops abilities in hubs
        // each ability has a spawn rate. This is the odds of that ability appearing
        // in a hub somewhere every minute

        // first fetch all of the abilities
        $abilities = $this->entityManager->getRepository('GameService:Ability')
            ->findAll();
        // spawn rate is between 0 and 1. Generate a random number in that range (to six decimal places)
        $accuracy = 10000000;

        $updatedHubs = [];
        $hubsRepo = $this->entityManager->getRepository('GameService:Hub');
        $totalHubs = $hubsRepo->countAll();
        foreach ($abilities as $ability) {
            $this->logger->info('-- "' . $ability->getName() . '" rate: ' . $ability->getSpawnRate());
            $rand = mt_rand(0, $accuracy) / $accuracy;
            $this->logger->info('Random number generated is ' . $rand);
            if ($rand > $ability->getSpawnRate()) {
                // not this time. exit early
                continue;
            }

            // find a random hub
            $randomHubOffset = mt_rand(0, $totalHubs-1);
            $hub = $hubsRepo->getSingleHubAtOffset($randomHubOffset);
            $currentStatus = $hub->getStatus();
            $currentStatus->createAbility($ability->getId());
            $hub->setStatus($currentStatus);

            $this->logger->info('Adding "' . $ability->getName() . '" to ' . $hub->getName());
            $updatedHubs[] = $hub;
        }

        $toBeUpdated = count($updatedHubs);
        $this->logger->info('Hubs to be updated with new abilities: ' . $toBeUpdated);
        if (!$toBeUpdated) {
            return;
        }

        // start transaction
        $this->logger->info('Starting Transaction');
        $this->entityManager->beginTransaction();

        try {
            // persist all the entities
            foreach ($updatedHubs as $hub) {
                $this->entityManager->persist($hub);
            }

            $this->logger->info('Committing Transaction');
            $this->entityManager->flush();
            $this->commit();
        } catch (Exception $e) {
            // rollback and rethrow
            $this->logger->error($e->getMessage());
            $this->rollback();
            throw $e;
        }
    }

    private function reapPlayer(Player $player)
    {
        // find the position of the player (they must be in a hub to have negative rate)
        $position = $this->entityManager->getRepository('GameService:Position')
            ->findHubPositionForPlayerWithOwner($player);

        // the destination upon death will be the home hub
        $homeHub = $player->getHomeHub();
        $this->logger->info('Player will be sent home to ' . $homeHub->getName());

        // all timing based on the time of death for the player
        $calculationTime = $player->getTimeOfDeath();

        // the player died. their score is now zero
        $player->setPoints(Game::INITIAL_SCORE);
        $player->setPointsCalculationTime($calculationTime);
        // todo - calculate point rate fresh based on all inputs (as this will then support higher depreciation)
        $player->setPointsRate(Game::INITIAL_SCORE_RATE);
        // reset their time of death, as they are going somewhere safe
        $player->setTimeOfDeath(null);

        $hub = $position->getHub();
        $owner = null;
        if ($hub) {
            $owner = $hub->getOwner();
            if ($owner) {
                // the owner has lost a paying squatter; their rate must change
                $owner = $this->updatePlayerScore($owner, $calculationTime);
                $owner = $this->adjustPointRate($owner, -Game::SQUATTERS_COST, $calculationTime);
            }
        }

        // close old position
        $position->setCompletedTime($calculationTime);

        // make a new position
        $newPosition = new Position($player, $calculationTime, $homeHub);

        // start transaction
        $this->logger->info('Starting Transaction');
        $this->entityManager->beginTransaction();

        try {
            // persist all the entities
            $this->entityManager->persist($position);
            $this->entityManager->persist($newPosition);
            $this->entityManager->persist($player);
            if ($owner) {
                $this->entityManager->persist($owner);
            }

            $this->logger->info('Committing Transaction');
            $this->entityManager->flush();
            $this->commit();
        } catch (Exception $e) {
            // rollback and rethrow
            $this->logger->error($e->getMessage());
            $this->rollback();
            throw $e;
        }
    }

    private function passportControlPosition(Position $position)
    {
        $spoke = $position->getSpoke();
        $player = $position->getPlayer();
        $this->logger->info('Player: ' . $player->getNickname());

        // figure out the destination
        $destinationHub = ($position->getReverseDirection()) ? $spoke->getStartHub() : $spoke->getEndHub();

        // get full Hub details with owner
        /** @var HubRepository $hubRepo */
        $hubRepo = $this->entityManager->getRepository('GameService:Hub');
        $destinationHub = $hubRepo->getHubByIdWithOwner($destinationHub);

        $this->logger->info('Destination: ' . $destinationHub->getName());

        // coming from a spoke all times will be based based on the previous position end time
        $calculationTime = $position->getEndTime();

        // we need to save the players accurate score as they move into the hub (before changing rate)
        $player = $this->updatePlayerScore($player, $calculationTime);

        // we're moving from a spoke to a hub. The players point rate is reduced
        $pointRateDiff = -Game::TRAVELLING_RATE;

        $owner = $destinationHub->getOwner();
        if ($owner) {
            if ($owner->getId() != $player->getId()) {
                $this->logger->info('Hub is owned by ' . $owner->getNickname());
                // calculate an up to date score for this owner (before changing rate)
                $owner = $this->updatePlayerScore($owner, $calculationTime);

                // increase the owners score for the new arrival
                $owner = $this->adjustPointRate($owner, Game::SQUATTERS_COST, $calculationTime);

                // decrease the squatters score - todo: unless in the same clan OR an ability is in play
                $pointRateDiff = $pointRateDiff - Game::SQUATTERS_COST;
            } else {
                $this->logger->info('Hub is owned by Player');
            }
        }

        $player = $this->adjustPointRate($player, $pointRateDiff, $calculationTime);

        // close old position
        $position->setCompletedTime($calculationTime);

        // make a new position
        $newPosition = new Position($player, $calculationTime, $destinationHub);

        // start transaction
        $this->logger->info('Starting Transaction');
        $this->entityManager->beginTransaction();

        try {
            // persist all the entities
            $this->entityManager->persist($position);
            $this->entityManager->persist($newPosition);
            $this->entityManager->persist($player);
            if ($owner) {
                $this->entityManager->persist($owner);
            }

            $this->logger->info('Committing Transaction');
            $this->entityManager->flush();
            $this->commit();
        } catch (Exception $e) {
            // rollback and rethrow
            $this->logger->error($e->getMessage());
            $this->rollback();
            throw $e;
        }
    }
}
