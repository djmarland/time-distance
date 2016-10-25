<?php
namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class GrimReaperCommand extends ContainerAwareCommand
{
    private $container;
    private $logger;

    protected function configure()
    {
        $this
            ->setName('game:grimreaper')
            ->setDescription('Deal out death');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->container = $this->getContainer();
        $this->logger = $this->container->get('logger');

        $this->logger->notice('Beginning Grim Reaper Command');
        $this->container->get('app.services.game_management')->performReaping();
        $this->logger->notice('Shutdown Grim Reaper Command');
    }
}