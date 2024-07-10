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
    private const START_SCORE = 20;
    private const START_LENGTH = 10;
    public const START_SPEED = 3;
    public const BOOST_SPEED = 10;
    private const START_ANGLE = M_PI / 2;
    private const SPAWN_ZONE = 0.6;

    public function __construct(private readonly SnakeRepositoryInterface $snakeRepository)
    {
    }

    public function createSnake(): Snake
    {
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
                         self::START_SCORE,
                         $color);
    }

    public function setSnakeData(Snake $snake,
                                 int $x,
                                 int $y,
                                 int $radius,
                                 string $color,
                                 array $oldSnakeBody): void
    {
        $snake->setHeadX($x);
        $snake->setHeadY($y);
        $snake->setRadius($radius);

        $newBody = [];
        foreach ($oldSnakeBody as $bodyPart)
        {
            $newBody[] = new BodyPart($bodyPart['x'],
                                      $bodyPart['y'],
                                      $radius,
                                      $color);
        }
        $snake->setBodyParts($newBody);
    }

    /**
     * @return array<int, Snake>
     */
    public function getSnakes(): array
    {
        return $this->snakeRepository->getSnakes();
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
}