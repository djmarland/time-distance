<?php

namespace AppBundle;

/**
 * The entire set of page data is passed into this presenter
 */
class View
{
    private $data = [];
    private $appConfig;
    private $meta = [
        'title' => 'Time & Distance',
        'fullTitle' => '',
        'siteTitle' => '',
        'environment' => 'prod',
        'canonicalUrl' => ''
    ];

    public function __construct($env = null)
    {
        if ($env) {
            $this->meta['environment'] = $env;
        }
        $this->updateConfig();
    }

    public function updateConfig()
    {
        $this->meta['title'] = 'Time and Distance';
        $this->meta['fullTitle'] = 'Time and Distance';
        $this->meta['siteTitle'] = 'Time and Distance';
        $requestPath = $_SERVER['REQUEST_URI'] ?? '/';
        $this->meta['canonicalUrl'] = '' . $requestPath;
    }

    public function set(
        string $key,
        $value,
        bool $allowedInFeed = null
    ) {
        if (is_null($allowedInFeed)) {
            $allowedInFeed = false;
            if (isset($this->data[$key])) {
                $allowedInFeed = $this->data[$key]->inFeed;
            }
        }

        $this->data[$key] = (object) [
            'data' => $value,
            'inFeed' => $allowedInFeed,
        ];
    }

    public function get($key)
    {
        if (isset($this->data[$key])) {
            return $this->data[$key]->data;
        }
        throw new \Exception(); // todo - use a custom one
    }

    public function getData()
    {
        // meta and config always present
        $data = [
            'meta' => $this->meta,
            'appConfig' => $this->appConfig,
        ];
        ksort($this->data);
        foreach ($this->data as $key => $value) {
            $data[$key] = $value->data;
        }

        // add the feed data
        $data['feedData'] = $this->getFeedData(true);
        return $data;
    }

    public function getFeedData($ignoreMeta = false)
    {
        $data = (object) [];
        if (!$ignoreMeta) {
            $data->meta = (object) $this->meta;
        }
        ksort($this->data);
        foreach ($this->data as $key => $value) {
            if ($value->inFeed) {
                $data->$key = $value->data;
            }
        }

        return $data;
    }

    public function setTitle(string $title)
    {
        $this->meta['title'] = $title;
        $this->meta['fullTitle'] = $title . ' - ' . '';
    }

    // use this when you don't want the auto appended suffix
    public function setFullTitle(string $title)
    {
        $this->meta['fullTitle'] = $title;
    }
}
