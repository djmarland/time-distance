<?php

namespace AppBundle\Controller;

use AppBundle\View;
use DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Controller\Controller as BaseController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Controller extends BaseController implements ControllerInterface
{

    /** @var View */
    public $view;

    /** @var Request */
    public $request;

    protected $currentPage = 1;
    protected $appConfig;

    private $applicationTime;

    protected $cacheTime = 60; // default cache time

    /** Setup common tasks for a controller */
    public function initialize(Request $request)
    {
        $this->request = $request;
        $this->view = new View(
            $this->get('kernel')->getEnvironment()
        );

        $this->applicationTime = new DateTimeImmutable(); // @todo - allow this to be set/overridden
    }

    public function toView(
        string $key,
        $value,
        $inFeed = null
    ): Controller {
        $this->view->set($key, $value, $inFeed);
        return $this;
    }

    public function fromView(string $key)
    {
        return $this->view->get($key);
    }

    public function setTitle(string $title): Controller
    {
        $this->view->setTitle($title);
        return $this;
    }

    protected function getApplicationTime(): DateTimeImmutable
    {
        return $this->applicationTime;
    }

    protected function getCurrentPage(): int
    {
        $page = $this->request->get('page', 1);

        // must be an integer string
        if (strval(intval($page)) !== strval($page) ||
            $page < 1
        ) {
            throw new HttpException(404, 'No such page value');
        }
        return (int) $page;
    }

    protected function setCacheHeaders(Response $response)
    {
        if ($this->cacheTime) {
            $response->setPublic();

            $response->setMaxAge($this->cacheTime);
            $response->setSharedMaxAge($this->cacheTime);
        } else {
            $response->setPrivate();
            $response->setMaxAge(0);
        }
    }

    protected function renderJSON()
    {
        return $this->renderTemplate('json');
    }

    protected function renderTemplate($template, $title = null)
    {
        if ($title) {
            $this->setTitle($title);
        }

        $format = $this->request->get('format', null);
        if ($format == 'json' || $template == 'json') {
            $response = new JsonResponse($this->view->getFeedData($template == 'json'));
            $this->setCacheHeaders($response);
            return $response;
        }

        $ext = 'html';
        if (in_array($format, ['inc'])) {
            $ext = $format;
        } elseif ($format) {
            throw new HttpException(404, 'Invalid Format');
        }

        $response = new Response();
        $this->setCacheHeaders($response);

        $path = 'AppBundle:' . $template . '.' . $ext . '.twig';
        return $this->render($path, $this->view->getData(), $response);
    }

    protected function renderEmail($viewPath, $mailData)
    {
        $viewPath = 'AppBundle:emails:' . $viewPath . '.html.twig';
        $data = $this->view->getData();
        $data['email'] = $mailData;
        return $this->renderView($viewPath, $data);
    }
}
