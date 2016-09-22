<?php

namespace GameService\Data\Database\Mapper;

use DateTime;
use DateTimeImmutable;

abstract class Mapper
{
    protected $mapperFactory;

    public function __construct(
        MapperFactory $mapperFactory
    ) {
        $this->mapperFactory = $mapperFactory;
    }

    public function convertDateTime($source)
    {
        if ($source instanceof DateTime) {
            return DateTimeImmutable::createFromMutable($source);
        }
        return null;
    }
}
