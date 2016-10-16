<?php

namespace GameService\Data\Database\Mapper;

use GameService\Domain\Entity\Transaction;

class TransactionMapper extends Mapper
{
    public function getDomainModel(array $item): Transaction
    {
        $hub = $this->mapperFactory->createHubMapper()->getDomainModel($item['hub']);
        $player = $this->mapperFactory->createPlayerMapper()->getDomainModel($item['player']);

        $domain = new Transaction(
            $item['id'],
            $hub,
            $player,
            $item['type'],
            $item['amount']
        );
        return $domain;
    }
}
