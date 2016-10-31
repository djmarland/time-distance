<?php

namespace GameService\Service;

use GameService\Data\Database\Entity\Player as PlayerEntity;
use GameService\Domain\Entity\Player;

class GameActionService extends Service
{
    public function useAbility(
        Player $player,
        \stdClass $action
    ) {
        $abilityId = $action->ability;
        $targetId = $action->target;

        $playerEntity = $this->getEntity('Player')->findByDbId($player->getId());

        switch ($abilityId) {
            case 'attack-hub':
                return $this->abilityAttackHub($playerEntity, $targetId);
                break;
            default:
                throw new \InvalidArgumentException('Invalid Ability ID');
        }
    }

    private function abilityAttackHub(
        PlayerEntity $playerEntity,
        int $targetId
    ) {
        // to attack a hub:
        // - you must be in the hub
        // - you must have an attack available
        // - the hub must be owned by another player

    }
}
