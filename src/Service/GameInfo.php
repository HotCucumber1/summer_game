<?php

namespace App\Service;

use App\Entity\Point;
use App\Entity\Snake;
use App\Entity\Wall;

class GameInfo
{
    const START_POINTS_AMOUNT = 10;
    const DEFAULT_ROTATION_ANGLE = M_PI / 32;
    private int $counter = 0;
    private Snake $snake;

    public function __construct(private readonly CollisionServiceInterface $collisionService,
                                private readonly PointService              $pointService,
                                private readonly SnakeService              $snakeService,
                                private readonly UserService               $userService)
    {
        $this->snake = $this->snakeService->createSnake();
        for ($i = 0; $i < self::START_POINTS_AMOUNT; $i++)
        {
            $this->pointService->addPoint(-Wall::$radius, -Wall::$radius,
                                           Wall::$radius,  Wall::$radius);
        }
    }

    public function mouseMovement(Snake $snake, array $controlInfo): void
    {
        $mouseX = $controlInfo['mouseX'];
        $mouseY = $controlInfo['mouseY'];

        // TODO: спросить Ильсафа про управление
    }

    public function keyMovement(array $controlInfo): void
    {
        $direction = $this->snake->getDirection();
        $angle = $direction->getAngle();

        if ($controlInfo['up'])
        {
            $direction->setAngle($angle + ((3 * M_PI / 2 < $angle || $angle < M_PI / 2) ?
                                                self::DEFAULT_ROTATION_ANGLE :
                                                -self::DEFAULT_ROTATION_ANGLE));
        }
        if ($controlInfo['down'])
        {
            $direction->setAngle($angle + ((3 * M_PI / 2 < $angle || $angle < M_PI / 2) ?
                                                -self::DEFAULT_ROTATION_ANGLE :
                                                self::DEFAULT_ROTATION_ANGLE));
        }
        if ($controlInfo['left'])
        {
            $direction->setAngle($angle + (($angle < M_PI) ?
                                                self::DEFAULT_ROTATION_ANGLE :
                                                -self::DEFAULT_ROTATION_ANGLE));
        }
        if ($controlInfo['right'])
        {
            $direction->setAngle($angle + (($angle < M_PI) ?
                                                -self::DEFAULT_ROTATION_ANGLE :
                                                self::DEFAULT_ROTATION_ANGLE));
        }
        if ($controlInfo['boost'])
        {
            $newSpeed = $direction->getSpeed() * 2;
            $direction->setSpeed($newSpeed);
        }

        $this->snake->setDirection($direction);
    }

    public function getData(): array
    {
        // Уменьшить радиус зоны
        // $this->compressWall();
        $this->snakeService->move($this->snake);

        // проверить столкновение
        $this->checkBumps();

        // проверить точки
        $this->updatePoints();

        // проверить, жива ли змея
        $this->checkSnakeDeath();
        $snakeData = [];
        if ($this->snake->getAliveStatus())
        {
            $snakeData = $this->getSnakeData();
        }

        // Информация по точкам
        $points = $this->pointService->allPoints();
        $pointsData = [];
        foreach ($points as $point)
        {
            if ($point->getStatus())
            {
                $pointsData[] = [
                    'x' => $point->getX(), //- $speed->getSpeed() * cos($speed->getAngle()),
                    'y' => $point->getY(), //- $speed->getSpeed() * sin($speed->getAngle()),
                    'color' => $point->getColor()
                ];
            }
        }

        return [
            'snake' => $snakeData,
            'points' => $pointsData,
            'wall' => Wall::$radius
        ];
    }

    private function getSnakeData(): array
    {
        $x = $this->snake->getHeadX();
        $y = $this->snake->getHeadY();
        $radius = $this->snake->getRadius();
        $score = $this->snake->getScore();

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

        return [
            'x' => $x,
            'y' => $y,
            'body' => $bodyData,
            'radius' => $radius,
            'score' => $score,

            // TODO: убрать угол, нужны только для отладки
            'angleRad' => $this->snake->getDirection()->getAngle(),
            'angleDeg' => rad2deg($this->snake->getDirection()->getAngle()),
        ];
    }

    private function checkBumps(): void
    {
        if ($this->collisionService->isWallBump($this->snake) ||
            $this->collisionService->isSnakeBump($this->snake) ||
            $this->collisionService->isSnakeBump($this->snake))
        {
            // TODO: закоментировонно для отладки
            /* $this->snakeService->die($this->snake);
            $id = SessionService::takeUserIdFromSession();
            $score = $this->snake->getScore();

            $this->userService->setUserScore($id, $score);*/
        }
    }

    private function updatePoints(): void
    {
        $points = $this->pointService->allPoints();
        foreach ($points as $point)
        {
            if ($this->collisionService->isPointEaten($this->snake, $point))
            {
                $this->pointService->clearPoint($point);
                $this->snake->increaseScore(Point::PRICE);
                $this->snakeService->grow($this->snake);
            }

            if ($point->getX() ** 2 + $point->getY() ** 2 >= Wall::$radius ** 2)
            {
                $this->pointService->clearPoint($point);
            }
        }
        $this->pointService->clearEatenPoints();
    }

    private function checkSnakeDeath(): void
    {
        if (!$this->snake->getAliveStatus())
        {
            $score = $this->snake->getScore();

            // $id = SessionService::takeUserIdFromSession();
            // $this->userService->setUserScore($id, $score);

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