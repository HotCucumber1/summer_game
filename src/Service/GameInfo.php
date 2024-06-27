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
        if ($this->collisionService->isWallBump($snake, $wall) ||
            $this->collisionService->isSnakeBump($snake))
        {
            $snake->setAliveStatus(false);
        }
    }

    public function buttonControl(Snake $snake, array $controlInfo): void
    {
        if ($controlInfo['up'])
        {
            // TODO: go up
        }
        if ($controlInfo['down'])
        {
            // TODO: go down
        }
        if ($controlInfo['left'])
        {
            // TODO: go left
        }
        if ($controlInfo['right'])
        {
            // TODO: go right
        }
    }

    public function mouseControl(Snake $snake, array $controlInfo)
    {
        $mouseX = $controlInfo['mouseX'];
        $mouseY = $controlInfo['mouseY'];

        $snakeX = $snake->getHeadX();
        $snakeY = $snake->getHeadY();
        // TODO: спросить Ильсафа про управление
    }

    public function checkPoints(): void
    {
        // TODO: циклом проверять все точки
    }

    public function getData(Snake $snake): array
    {
        // TODO: получить и сформировать данные для отправки на фронт
    }

    public function score(Snake $snake): void
    {

    }
}