<?php

namespace App\Service;

use App\Entity\Direction;
use App\Entity\Snake;
use App\Entity\Wall;

class GameInfo
{
    const START_X = 0;
    const START_Y = 0;
    const START_BODY = [];
    const START_RADIUS = 5;
    const START_X_DIR = 0;
    const START_Y_DIR = -5;
    const START_POINTS_AMOUNT = 50;

    public function __construct(private CollisionService $collisionService,
                                private PointService $pointService,
                                private SnakeService $snakeService)
    {
    }

    public function start(): void
    {
        $startSpeed = new Direction(self::START_X_DIR,
                                    self::START_Y_DIR);
        $this->snakeService->createSnake();
        $snake = new Snake(null,
                           self::START_X,
                           self::START_Y,
                           self::START_BODY,
                           self::START_RADIUS,
                           $startSpeed);
        for ($i = 0; $i < self::START_POINTS_AMOUNT; $i++)
        {
            $this->pointService->addPoint();
        }
    }

}