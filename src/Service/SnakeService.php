<?php

namespace App\Service;
use App\Entity\BodyPart;
use App\Entity\Snake;

class SnakeService
{
    public function __construct()
    {
    }

    public function move(int $x, int $y, Snake $snake): void
    {
        $snake->setHeadX($x);
        $snake->setHeadY($y);
    }

    public function grow(Snake $snake): void
    {
        $this->changeLength($snake);
        $this->changeRadius($snake);
    }

    public function deleteSnake(Snake $snake)
    {

    }

    private function changeLength(Snake $snake): void
    {
        $snake->addBodyPart(10, 10, '#EEE');
    }

    private function changeRadius(Snake $snake): void
    {
        $body = $snake->getBodyParts();
        foreach ($body as $bodyPart)
        {
            $radius = $bodyPart->getRadius();
            $bodyPart->setRadius($radius+1);
        }
    }
}