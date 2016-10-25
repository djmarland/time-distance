<?php
namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class PassportControlCommand extends ContainerAwareCommand
{
    private $container;
    private $logger;

    protected function configure()
    {
        $this
            ->setName('game:passportcontrol')
            ->setDescription('Handle all arrivals');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->container = $this->getContainer();
        $this->logger = $this->container->get('logger');

        $this->logger->notice('Beginning Passport Control Command');
        $this->container->get('app.services.game_management')->performPassportControl();
        $this->logger->notice('Shutdown Passport Control Command');
    }
}