<?php

namespace App\Service;

use App\Entity\Direction;
use App\Entity\Snake;
use App\Entity\Wall;

class GameInfo
{
    const START_POINTS_AMOUNT = 50;
    private static int $x = 0;
    private static int $y = 0;

    public function __construct(private readonly CollisionService $collisionService,
                                private readonly PointService $pointService,
                                private readonly SnakeService $snakeService)
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

    public function mouseControl(Snake $snake, array $controlInfo): void
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

    public function checkSnake(Snake $snake): void
    {
    }

    public function getData(Snake $snake): ?string
    {
        // TODO: получить и сформировать данные для отправки на фронт
        self::$x += 5;
        self::$y += 5;
        $json = [
            'snake' => [
                'x' => self::$x,
                'y' => self::$y,
                'body' => [],
                'radius' => 5,
                'speed' =>  5,
                'score' => 100
            ],
            'points' => [
                [
                    'x' => 15,
                    'y' => 15,
                    'color' => '#AAA'
                ],
                [
                    'x' => 20,
                    'y' => 40,
                    'color' => '#AAA'
                ]
            ]
        ];
        return json_encode($json);

    }

    public function score(Snake $snake): void
    {
    }
}