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
                         self::START_SPEED,
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