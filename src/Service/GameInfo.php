<?php

namespace App\Service;

use App\Entity\Point;
use App\Entity\Snake;
use App\Entity\Wall;
use Config\Config;

class GameInfo
{
    const START_POINTS_AMOUNT = 5;
    private Snake $snake;

    public function __construct(private readonly CollisionService $collisionService,
                                private readonly PointService $pointService,
                                private readonly SnakeService $snakeService)
    {
        $this->snake = $this->snakeService->createSnake();
        for ($i = 0; $i < self::START_POINTS_AMOUNT; $i++)
        {
            $this->pointService->addPoint(-Wall::$radius, -Wall::$radius, Wall::$radius, Wall::$radius);
        }
    }

    public function checkBumps(): void
    {
        if ($this->collisionService->isWallBump($this->snake) ||
            $this->collisionService->isSnakeBump($this->snake))
        {
            $this->snake->setAliveStatus(false);
        }
    }

    public function checkPoints(): void
    {
        $points = $this->pointService->allPoints();
        foreach ($points as $point)
        {
            if ($this->collisionService->isPointEaten($this->snake, $point))
            {
                $point->setStatus(false);
                $this->snake->increaseScore(Point::PRICE);
                $this->snakeService->grow($this->snake);
            }
        }
    }

    public function snakeInfo(): void
    {
        if (!$this->snake->getAliveStatus())
        {
            // TODO: этот счет записать юзеру

            $score = $this->snake->getScore();
            $body = $this->snake->getBodyParts();
            $pointsPerPart = intdiv($score, count($body));

            foreach ($body as $bodyPart)
            {
                $x1 = $bodyPart->getX() - $bodyPart->getRadius();
                $y1 = $bodyPart->getY() - $bodyPart->getRadius();

                $x2 = $bodyPart->getX() + $bodyPart->getRadius();
                $y2 = $bodyPart->getY() + $bodyPart->getRadius();

                for ($j = 0; $j < $pointsPerPart; $j++)
                {
                    $this->pointService->addPoint($x1, $y1, $x2, $y2);
                }
            }
        }
    }

    public function setSnakeDirection(array $controlInfo): void
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
        if ($controlInfo['Shift'])
        {
            // TODO: boost
        }
    }

    public function mouseControl(Snake $snake, array $controlInfo): void
    {
        $mouseX = $controlInfo['mouseX'];
        $mouseY = $controlInfo['mouseY'];

        // $this->snakeService->move($mouseX, $mouseY, $snake);
        // TODO: спросить Ильсафа про управление
    }

    public function compressWall(): void
    {
        if (Wall::$radius > 100)
        {
            Wall::$radius -= 1;
        }
    }

    public function getData(): ?array
    {
        // Уменьшить радиус змеи
        $this->compressWall();

        // Информация по змее
        $x = $this->snake->getHeadX();
        $y = $this->snake->getHeadY();

        $body = $this->snake->getBodyParts();
        $bodyData = [];
        foreach ($body as $bodyPart)
        {
            $bodyData[] = [
                'x' => $bodyPart->getX(),
                'y' => $bodyPart->getY(),
                'color' => $bodyPart->getColor()
            ];
        }

        // Информация по точкам
        $points = $this->pointService->allPoints();
        $pointsData = [];
        foreach ($points as $point)
        {
            if ($point->getStatus())
            {
                $pointsData[] = [
                    'x' => $point->getCoordX(),
                    'y' => $point->getCoordY(),
                    'color' => $point->getColor()
                ];
            }
        }

        $radius = $this->snake->getRadius();
        $speed = $this->snake->getSpeed();
        $score = $this->snake->getScore();

        return [
            'snake' => [
                'x' => $x,
                'y' => $y,
                'body' => $bodyData,
                'radius' => $radius,
                'speed' =>  $speed, // или просто число?
                'score' => $score
            ],
            'points' => $pointsData,
            'wall' => Wall::$radius
        ];
    }
}