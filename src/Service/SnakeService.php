<?php

namespace App\Service;
use App\Entity\Snake;

class SnakeService
{
    public function __construct()
    {
    }

    public function move(int $x, int $y, Snake $snake): void
    {
        $lastX = $snake->getHeadX();
        $lastY = $snake->getHeadY();

        $snake->setHeadX($x);
        $snake->setHeadY($y);

        $body = $snake->getBodyParts();
        $this->moveBody($body, $lastX, $lastY);
    }

    public function grow(Snake $snake): void
    {
        $this->increaseLength($snake);
        $this->increaseRadius($snake);
    }

    public function decline(Snake $snake): void
    {
        $this->decreaseLength($snake);
        $this->decreaseRadius($snake);
    }

    public function deleteSnake(Snake $snake)
    {
        // TODO: обращение к репозиторию и удаление из него данного экземпдяра
    }

    private function moveBody(array $body, int $x, int $y): void
    {
        foreach ($body as $bodyPart)
        {
            $lastX = $bodyPart->getX();
            $lastY = $bodyPart->getY();

            $bodyPart->setX($x);
            $bodyPart->setY($y);

            $x = $lastX;
            $y = $lastY;
        }
    }

    private function increaseLength(Snake $snake): void
    {
        $snake->addBodyPart(10, 10, '#EEE');
    }

    private function increaseRadius(Snake $snake): void
    {
        $body = $snake->getBodyParts();
        foreach ($body as $bodyPart)
        {
            $radius = $bodyPart->getRadius();
            $bodyPart->setRadius($radius + 1);
        }
    }

    private function decreaseLength(Snake $snake): void
    {
        $snake->deleteLastBodyPart();
    }

    private function decreaseRadius(Snake $snake): void
    {
        $body = $snake->getBodyParts();
        foreach ($body as $bodyPart)
        {
            $radius = $bodyPart->getRadius();
            $bodyPart->setRadius($radius - 1);
        }
    }
}