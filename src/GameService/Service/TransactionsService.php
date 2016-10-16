<?php

namespace GameService\Service;

use GameService\Domain\Entity\Transaction;

class TransactionsService extends Service
{
    const ENTITY = 'Transaction';

    public function findLatestConflictTransactions(int $limit = 10)
    {
        $qb = $this->getQueryBuilder(self::ENTITY);
        $qb->addSelect('Hub', 'Player', 'Cluster')
            ->join(self::ENTITY . '.hub', 'Hub')
            ->join(self::ENTITY . '.player', 'Player')
            ->join('Hub.cluster', 'Cluster')
            ->where(self::ENTITY . '.type IN (:types)')
            ->orderBy(self::ENTITY . '.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setParameter('types', Transaction::getConflictTypes());
        $results = $qb->getQuery()->getArrayResult();

        $transactions = [];
        $transactionMapper = $this->mapperFactory->createTransactionMapper();
        foreach($results as $result) {
            $transaction = $transactionMapper->getDomainModel($result);
            $transactions[] = $transaction;
        }
        return $transactions;
    }
}
