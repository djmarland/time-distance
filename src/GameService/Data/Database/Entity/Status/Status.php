<?php
namespace GameService\Data\Database\Entity\Status;

class Status
{
    protected $data = [];

    public function __construct($data = null)
    {
        if ($data) {
            $this->data = json_decode($data, true);
        }
    }

    public function __toString()
    {
        return json_encode($this->data);
    }
}