<?php

namespace App\Service;

use App\Entity\Direction;
use App\Entity\Point;
use App\Entity\Snake;
use App\Entity\Wall;
use config\Config;

class GameInfo
{
    const START_POINTS_AMOUNT = 50;

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
            $this->pointService->addPoint(1, 1, Config::$windowWidth, Config::$windowHeight);
        }
        return $snake;
    }

    public function checkBumps(Snake $snake): void
    {
        if ($this->collisionService->isWallBump($snake) ||
            $this->collisionService->isSnakeBump($snake))
        {
            $snake->setAliveStatus(false);
        }
    }

    public function checkPoints(Snake $snake): void
    {
        $points = $this->pointService->allPoints();
        foreach ($points as $point)
        {
            if ($this->collisionService->isPointEaten($snake, $point))
            {
                $point->setStatus(false);
                $snake->increaseScore(Point::PRICE);
                $this->snakeService->grow($snake);
            }
        }
    }

    public function snakeInfo(Snake $snake): void
    {
        if (!$snake->getAliveStatus())
        {
            // TODO: этот счет записать юзеру

            $score = $snake->getScore();
            $body = $snake->getBodyParts();
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

    public function getData(Snake $snake): ?string
    {
        // Информация по змее
        $x = $snake->getHeadX();
        $y = $snake->getHeadY();

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

        $radius = $snake->getRadius();
        $speed = $snake->getSpeed();
        $score = $snake->getScore();

        $json = [
            'snake' => [
                'x' => $x,
                'y' => $y,
                'body' => $bodyData,
                'radius' => $radius,
                'speed' =>  $speed, // или просто число?
                'score' => $score
            ],
            'points' => $pointsData
        ];
        return json_encode($json);
    }
}