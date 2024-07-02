<?php

namespace App\Service;
use App\Entity\BodyPart;
use App\Entity\Direction;
use App\Entity\Snake;
use Config\Config;

class SnakeService
{
    const START_X = 0;
    const START_Y = 0;
    const START_RADIUS = 15;
    const START_X_DIR = 0;
    const START_Y_DIR = -5;
    const START_SCORE = 0;
    const START_LENGTH = 10;

    public function __construct()
    {
    }

    public function createSnake(): Snake
    {
        $startSpeed = new Direction(self::START_X_DIR,
                                    self::START_Y_DIR);
        $color = Config::COLORS[array_rand(Config::COLORS)];

        $startBody = $this->createBody($color);
        return new Snake(null,
                         self::START_X,
                         self::START_Y,
                         $startBody,
                         self::START_RADIUS,
                         $startSpeed,
                         self::START_SCORE,
                         $color);
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

    public function die(Snake $snake): void
    {
        $snake->setAliveStatus(false);
    }

    private function createBody(string $color): array
    {
        // TODO: протестить создание
        $body = [];
        for ($i = 0; $i < self::START_LENGTH; $i++)
        {
            $body[] = new BodyPart(self::START_X,
                                  self::START_Y,
                                  self::START_RADIUS,
                                  $color);
        }
        return $body;
    }

    private function moveBody(array $body, int $x, int $y): void
    {
        // TODO: протестить передвижение
        $last = end($body);

        $last->setX($x);
        $last->setY($y);

        /* foreach ($body as $bodyPart)
        {
            $lastX = $bodyPart->getX();
            $lastY = $bodyPart->getY();

            $bodyPart->setX($x);
            $bodyPart->setY($y);

            $x = $lastX;
            $y = $lastY;
        } */
    }

    private function increaseLength(Snake $snake): void
    {
        $body = $snake->getBodyParts();
        $lastBodyPart = end($body);

        $snake->addBodyPart($lastBodyPart->getX(),
                            $lastBodyPart->getY(),
                            $snake->getColor());
    }

    private function increaseRadius(Snake $snake): void
    {
        $snake->setRadius($snake->getRadius() + 1);

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