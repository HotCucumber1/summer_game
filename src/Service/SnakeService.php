<?php

namespace App\Service;
use App\Entity\Direction;
use App\Entity\Snake;

class SnakeService
{
    const START_X = 0;
    const START_Y = 0;
    const START_BODY = [];
    const START_RADIUS = 5;
    const START_X_DIR = 0;
    const START_Y_DIR = -5;
    const START_SCORE = 0;

    public function __construct()
    {
    }

    public function createSnake(): Snake
    {
        $startSpeed = new Direction(self::START_X_DIR,
                                    self::START_Y_DIR);
        return new Snake(null,
                         self::START_X,
                         self::START_Y,
                         self::START_BODY,
                         self::START_RADIUS,
                         $startSpeed,
                         self::START_SCORE);
    }

    public function getSnake(): Snake
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

    public function deleteSnake(Snake $snake): void
    {
        $snake->setAliveStatus(false);
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