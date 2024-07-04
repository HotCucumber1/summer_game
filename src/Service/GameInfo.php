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

    public function __construct(private readonly CollisionServiceInterface $collisionService,
                                private readonly PointService              $pointService,
                                private readonly SnakeService              $snakeService)
    {
        $this->snake = $this->snakeService->createSnake();
        for ($i = 0; $i < self::START_POINTS_AMOUNT; $i++)
        {
            $this->pointService->addPoint(-Wall::$radius, -Wall::$radius, Wall::$radius, Wall::$radius);
        }
    }

    public function mouseMovement(Snake $snake, array $controlInfo): void
    {
        $mouseX = $controlInfo['mouseX'];
        $mouseY = $controlInfo['mouseY'];

        // $this->snakeService->move($mouseX, $mouseY, $snake);
        // TODO: спросить Ильсафа про управление
    }

    public function keyMovement(array $controlInfo): void
    {
        $direction = $this->snake->getDirection();
        $angle = $direction->getAngle();
        if ($controlInfo['up'])
        {
            if (- M_PI / 2 < $angle && $angle < M_PI / 2)
            {
                $direction->setAngle($angle - M_PI / 32);
            }
            else
            {
                $direction->setAngle($angle + M_PI / 32);
            }
        }
        if ($controlInfo['down'])
        {
            if (- M_PI / 2 < $angle && $angle < M_PI / 2)
            {
                $direction->setAngle($angle + M_PI / 32);
            }
            else
            {
                $direction->setAngle($angle - M_PI / 32);
            }
        }
        if ($controlInfo['left'])
        {
            if ($angle > 0)
            {
                $direction->setAngle($angle + M_PI / 32);
            }
            else
            {
                $direction->setAngle($angle - M_PI / 32);
            }
        }
        if ($controlInfo['right'])
        {
            if ($angle > 0)
            {
                $direction->setAngle($angle - M_PI / 32);
            }
            else
            {
                $direction->setAngle($angle + M_PI / 32);
            }
        }
        if ($controlInfo['boost'])
        {
            // TODO: boost
        }
        $this->snake->setDirection($direction);
        $this->snakeService->move($this->snake);
    }

    public function getData(): ?array
    {
        // обновить положение змеи на экране

        // Уменьшить радиус зоны
        $this->compressWall();

        // проверить столкновение
        // $this->checkBumps();

        // проверить точки
        $this->updatePoints();

        // проверить, жива ли змея
        $this->checkSnakeDeath();

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
        $speed = $this->snake->getDirection();
        $score = $this->snake->getScore();

        return [
            'snake' => [
                'x' => $x,
                'y' => $y,
                'body' => $bodyData,
                'radius' => $radius,
                'score' => $score
            ],
            'points' => $pointsData,
            'wall' => Wall::$radius
        ];
    }

    private function checkBumps(): void
    {
        if ($this->collisionService->isWallBump($this->snake) ||
            $this->collisionService->isSnakeBump($this->snake))
        {
            $this->snake->setAliveStatus(false);
        }
    }

    private function updatePoints(): void
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

    private function checkSnakeDeath(): void
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

    private function compressWall(): void
    {
        if (Wall::$radius > 100)
        {
            Wall::$radius -= 1;
        }
    }
}