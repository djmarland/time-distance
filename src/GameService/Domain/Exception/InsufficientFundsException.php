<?php

namespace GameService\Domain\Exception;

/**
 * For use when a transaction tried to occur but there weren't enough funds
 * Due to earlier checks this should hopefully not be thrown
 */
class InsufficientFundsException extends \Exception
{
}
