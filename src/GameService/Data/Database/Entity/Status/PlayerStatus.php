<?php
namespace GameService\Data\Database\Entity\Status;

class PlayerStatus extends Status
{
    public function getAbilityCounts(): array
    {
        return $this->data['abilityCounts'] ?? [];
    }

    public function addAbility(int $id)
    {
        if (!isset($this->data['abilityCounts'])) {
            $this->data['abilityCounts'] = [];
        }
        if (!isset($this->data['abilityCounts'][$id])) {
            $this->data['abilityCounts'][$id] = 0;
        }
        $this->data['abilityCounts'][$id]++;
    }
}