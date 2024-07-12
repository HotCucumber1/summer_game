<?php

namespace App\Service;
use App\Entity\BodyPart;
use App\Entity\Snake;
use App\Entity\Wall;
use App\Repository\SnakeRepositoryInterface;
use Config\Config;

class SnakeService
{
    private const START_RADIUS = 15;
    private const START_SCORE = 20;
    private const START_LENGTH = 10;
    private const SPAWN_ZONE = 0.6;

    public function __construct(private readonly SnakeRepositoryInterface $snakeRepository)
    {
    }

    public function createSnake(int $id): Snake
    {
        $color = Config::COLORS[array_rand(Config::COLORS)];

        // $id = SessionService::takeUserIdFromSession();
        do
        {
            $headX = random_int(-self::SPAWN_ZONE * Wall::$radius, self::SPAWN_ZONE * Wall::$radius);
            $headY = random_int(-self::SPAWN_ZONE * Wall::$radius, self::SPAWN_ZONE * Wall::$radius);
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

    public function getSnakeData(Snake $snake): array
    {
        $x = $snake->getHeadX();
        $y = $snake->getHeadY();
        $radius = $snake->getRadius();
        $score = $snake->getScore();

        $body = $snake->getBodyParts();
        $bodyData = [];
        foreach ($body as $bodyPart)
        {
            $bodyData[] = [
                'x' => $bodyPart->getX(),
                'y' => $bodyPart->getY(),
                'color' => $bodyPart->getColor()
            ];
        }

        return [
            'id' => $snake->getId(),
            'x' => $x,
            'y' => $y,
            'body' => $bodyData,
            'radius' => $radius,
            'score' => $score,
        ];
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