<?php

namespace App\Service;

use App\Entity\Direction;
use App\Entity\Snake;
use App\Entity\Wall;

class GameInfo
{
    const START_POINTS_AMOUNT = 50;

    public function __construct(private CollisionService $collisionService,
                                private PointService $pointService,
                                private SnakeService $snakeService)
    {
    }

    public function start(): Snake
    {
        $snake = $this->snakeService->createSnake();

        for ($i = 0; $i < self::START_POINTS_AMOUNT; $i++)
        {
            $this->pointService->addPoint();
        }
        return $snake;
    }

    public function checkBump(Snake $snake, Wall $wall): void
    {
        if ($this->collisionService->isWallBump($snake, $wall))
        {
            $snake->setAliveStatus(false);
        }
    }
}