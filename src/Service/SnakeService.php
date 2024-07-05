<?php

namespace App\Service;
use App\Entity\BodyPart;
use App\Entity\Direction;
use App\Entity\Snake;
use Config\Config;

class SnakeService
{
    const START_X = 10;
    const START_Y = 10;
    const START_RADIUS = 15;
    const START_SCORE = 0;
    const START_LENGTH = 10;
    const START_SPEED = 5;
    const START_ANGLE = M_PI / 2;

    public function __construct()
    {
    }

    public function createSnake(): Snake
    {
        $startDirection = new Direction(self::START_SPEED ,
                                        self::START_ANGLE);
        $color = Config::COLORS[array_rand(Config::COLORS)];

        $startBody = $this->createBody($color);
        return new Snake(null,
                         self::START_X,
                         self::START_Y,
                         $startBody,
                         self::START_RADIUS,
                         $startDirection,
                         self::START_SPEED,
                         self::START_SCORE,
                         $color);
    }

    public function move(Snake $snake): void
    {
        $lastX = $snake->getHeadX();
        $lastY = $snake->getHeadY();

        $speed = $snake->getDirection()->getSpeed();
        $angle = $snake->getDirection()->getAngle();

        $x = $lastX + $speed * cos($angle);
        $y = $lastY + $speed * sin($angle);

        $snake->setHeadX($x);
        $snake->setHeadY($y);

        // $body = $snake->getBodyParts();
        // $this->moveBody($body, $lastX, $lastY);
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