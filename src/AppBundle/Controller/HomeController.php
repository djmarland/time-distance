<?php

namespace AppBundle\Controller;

class HomeController extends Controller
{
    public function indexAction()
    {
        $this->view->setFullTitle(
            'Time & Distance'
        );

        return $this->renderTemplate('home:index');
    }
}
