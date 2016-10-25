<?php

namespace GameService\Service;

use DateTimeImmutable;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;
use GameService\Data\Database\Mapper\MapperFactory;
use Psr\Log\LoggerInterface;

abstract class Service
{
    const DEFAULT_LIMIT = 50;
    const DEFAULT_PAGE = 1;

    protected $entityManager;
    protected $appTimeProvider;
    protected $mapperFactory;
    protected $logger;

    public function __construct(
        EntityManager $entityManager,
        DateTimeImmutable $appTimeProvider,
        LoggerInterface $logger
    ) {
        $this->entityManager = $entityManager;
        $this->mapperFactory = new MapperFactory();
        $this->appTimeProvider = $appTimeProvider;
        $this->logger = $logger;
    }

    protected function getEntity(string $name): EntityRepository
    {
        return $this->entityManager
            ->getRepository('GameService:' . $name);
    }

    protected function getQueryBuilder(string $name): QueryBuilder
    {
        $entity = $this->getEntity($name);
        return $entity->createQueryBuilder($name);
    }

    protected function getOffset(
        int $limit,
        int $page
    ): int {
        return ($limit * ($page - 1));
    }

    protected function paginate(
        QueryBuilder $qb,
        int $limit,
        int $page
    ) {
        return $qb->setMaxResults($limit)
            ->setFirstResult($this->getOffset($limit, $page));
    }

    protected function rollback()
    {
        if ($this->entityManager->getConnection()->isTransactionActive()) {
            $this->entityManager->getConnection()->rollBack();
        }
    }
    protected function commit()
    {
        if (!$this->entityManager->getConnection()->isRollbackOnly()) {
            // everything was successful. commit the transaction
            $this->entityManager->getConnection()->commit();
        }
    }
}
