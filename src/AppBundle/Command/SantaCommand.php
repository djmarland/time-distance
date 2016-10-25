<?php
namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class SantaCommand extends ContainerAwareCommand
{
    private $container;
    private $logger;

    protected function configure()
    {
        $this
            ->setName('game:santa')
            ->setDescription('He comes bearing gifts');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->container = $this->getContainer();
        $this->logger = $this->container->get('logger');

        $this->logger->notice('Beginning Santa Command');
        $managementService = $this->container->get('app.services.game_management');
        $managementService->performSanta();
        $this->logger->notice('Shutdown Santa Command');
    }
}