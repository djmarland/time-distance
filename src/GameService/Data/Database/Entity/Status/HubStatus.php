<?php
namespace GameService\Data\Database\Entity\Status;

class HubStatus extends Status
{
    public function createAbility(int $abilityId)
    {
        // generate a random identifier for the ability
        $uniqueKey = md5(mt_rand(0,1000) . microtime());

        if (!isset($this->data['abilities'])) {
            $this->data['abilities'] = [];
        }

        $this->data['abilities'][] = [
            'id' => $abilityId,
            'uniqueKey' => $uniqueKey,
        ];
    }

    public function getAbilities(): array
    {
        return $this->data['abilities'] ?? [];
    }

    public function removeAbilityByKey(string $uniqueKey): int
    {
        foreach ($this->data['abilities'] as $i => $data) {
            $id = $data['id'];
            if ($data['uniqueKey'] == $uniqueKey) {
                unset($this->data['abilities'][$i]);
                return $id;
            }
        }
        throw new \RuntimeException('Tried to remove an ability that did not exist');
    }
}