<?php

namespace App\Service;
use App\Entity\BodyPart;
use App\Entity\Direction;
use App\Entity\Snake;
use App\Entity\Wall;
use App\Repository\SnakeRepositoryInterface;
use Config\Config;

class SnakeService
{
    private const START_RADIUS = 15;
    private const START_SCORE = 0;
    private const START_LENGTH = 10;
    public const START_SPEED = 5;
    public const BOOST_SPEED = 10;
    private const START_ANGLE = M_PI / 2;
    private const SPAWN_ZONE = 0.6;

    public function __construct(private readonly SnakeRepositoryInterface $snakeRepository)
    {
    }

    public function createSnake(): Snake
    {
        $startDirection = new Direction(self::START_SPEED ,
                                        self::START_ANGLE);
        $color = Config::COLORS[array_rand(Config::COLORS)];

        // $id = SessionService::takeUserIdFromSession();
        $id = 0;
        do
        {
            $headX = rand(-self::SPAWN_ZONE * Wall::$radius, self::SPAWN_ZONE * Wall::$radius);
            $headY = rand(-self::SPAWN_ZONE * Wall::$radius, self::SPAWN_ZONE * Wall::$radius);
        }
        while ($headX ** 2 + $headY ** 2 >= (self::SPAWN_ZONE * Wall::$radius) ** 2);

        $startBody = $this->createBody($color, $headX, $headY);
        return new Snake($id,
                         $headX,
                         $headY,
                         $startBody,
                         self::START_RADIUS,
                         $startDirection,
                         self::START_SPEED,
                         self::START_SCORE,
                         $color);
    }

    /**
     * @return array<int, Snake>
     */
    public function getSnakes(): array
    {
        return $this->snakeRepository->getSnakes();
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

        $this->moveBody($snake, $lastX, $lastY);
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

    private function createBody(string $color, float $x, float $y): array
    {
        $body = [];
        for ($i = 0; $i < self::START_LENGTH; $i++)
        {
            $body[] = new BodyPart($x, $y,
                                  self::START_RADIUS,
                                  $color);
        }
        return $body;
    }

    private function moveBody(Snake $snake, float $x, float $y): void
    {
        // TODO: протестить передвижение
        /*$last = end($body);

        $last->setX($x);
        $last->setY($y);
        */

        $body = $snake->getBodyParts();
        $angle = $snake->getDirection()->getAngle();
        $halfRadius = self::START_RADIUS / 2;

        foreach ($body as $bodyPart)
        {
            $lastX = $bodyPart->getX() - $halfRadius * cos($angle);
            $lastY = $bodyPart->getY() - $halfRadius * sin($angle);

            $bodyPart->setX($x);
            $bodyPart->setY($y);

            $x = $lastX;
            $y = $lastY;
        }
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
        $newRadius = $snake->getRadius() + 1;
        $snake->setRadius($newRadius);

        $body = $snake->getBodyParts();
        foreach ($body as $bodyPart)
        {
            $bodyPart->setRadius($newRadius);
        }
    }

    private function decreaseLength(Snake $snake): void
    {
        $snake->deleteLastBodyPart();
    }

    private function decreaseRadius(Snake $snake): void
    {
        $newRadius = $snake->getRadius() - 1;
        $body = $snake->getBodyParts();
        foreach ($body as $bodyPart)
        {
            $bodyPart->setRadius($newRadius);
        }
    }
}