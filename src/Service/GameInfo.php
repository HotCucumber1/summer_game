<?php

namespace App\Service;

use App\Entity\Point;
use App\Entity\Snake;
use App\Entity\Wall;

class GameInfo
{
    public bool $isStart = false;
    public bool $inGame = false;
    public bool $isWon = false;
    public bool $checkSnakeCollision = false;
    /**
     * @var Snake[]
     */
    public array $snakes = [];
    private const START_POINTS_AMOUNT = 2000;
    private const MIN_WALL_RADIUS = 500;
    private const COMPRESSION = 1;
    private const POINT_CHECK_DISTANCE = 20;
    private int $wallRadius = Wall::START_RADIUS;


    public function __construct(private readonly CollisionService $collisionService,
                                private readonly PointService     $pointService,
                                private readonly SnakeService     $snakeService,
                                private readonly UserService      $userService)
    {
        for ($i = 0; $i < self::START_POINTS_AMOUNT; $i++)
        {
            $this->pointService->addPoint(-$this->wallRadius, -$this->wallRadius,
                                           $this->wallRadius,  $this->wallRadius);
        }
    }

    public function addUserToGame(string $id, string $name): void
    {
        if (!isset($this->snakes[$id]))
        {
            $this->snakes[$id] = $this->snakeService->createSnake($id, $name);
            echo "Create {$id} snake" . PHP_EOL;
        }
    }

    public function setGameStatus(array $data, int $id): void
    {
        $snake = $this->snakes[$id];
        if (!$snake->getAliveStatus())
        {
            return;
        }
        $this->snakeService->setSnakeData($snake,
                                          $data['snake']['x'],
                                          $data['snake']['y'],
                                          $data['snake']['radius'],
                                          $data['snake']['body'],
                                          $data['snake']['color'],
                                          $data['snake']['boost'],
                                          $data['snake']['angle']);

        if ($this->checkSnakeCollision)
        {
            $this->checkSnakeBumps($snake);
        }
        if (!$this->isWon)
        {
            $this->checkWallBumps($snake);
        }
        $this->updatePoints($snake);
        $this->checkSnakeDeath($snake);
        $this->compressWall();
    }

    public function getData(): array
    {
        // информация по другим игрокам
        $userData = [];
        foreach ($this->snakes as $user => $userSnake)
        {
            if ($userSnake->getAliveStatus())
            {
                $userData[$userSnake->getName()] = $this->snakeService->getSnakeData($userSnake);
            }
        }

        if (!$this->isStart)
        {
            return [
                'users' => $userData,
                'wall' => $this->wallRadius,
            ];

        }
        // Информация по точкам
        $pointsData = [];
        $points = $this->pointService->allPoints();
        foreach ($points as $point)
        {
            if ($point->getStatus())
            {
                $pointsData[] = [
                    'x' => $point->getX(),
                    'y' => $point->getY(),
                    'c' => $point->getColor()
                ];
            }
        }
        return [
            'users' => $userData,
            'points' => $pointsData,
            'wall' => $this->wallRadius,
        ];

    }

    public function deleteUser(int $id): void
    {
        unset($this->snakes[$id]);
    }

    public function saveUserVictory(string $name): void
    {
        $user = $this->userService->getUserByName($name);
        $score = $user->getScore();
        $this->userService->setUserScore($name, $score + 1);
    }

    private function checkSnakeBumps(Snake $snake): void
    {
        if (!$snake->getAliveStatus())
        {
            return;
        }
        if ($this->collisionService->isSnakeBump($snake, $this->snakes))
        {
            $snake->setAliveStatus(false);
        }
    }

    private function checkWallBumps(Snake $snake): void
    {
        if (!$snake->getAliveStatus())
        {
            return;
        }
        if ($this->collisionService->isWallBump($snake, $this->wallRadius))
        {
            $snake->setAliveStatus(false);
        }
    }

    private function updatePoints(Snake $snake): void
    {
        if (!$snake->getAliveStatus())
        {
            return;
        }
        $points = $this->pointService->allPoints();
        foreach ($points as $point)
        {
            if (abs($snake->getHeadX() - $point->getX()) < self::POINT_CHECK_DISTANCE &&
                abs($snake->getHeadY() - $point->getY()) < self::POINT_CHECK_DISTANCE)
            {
                if ($point->getStatus() && $this->collisionService->isPointEaten($snake, $point))
                {
                    $this->pointService->clearPoint($point);
                    $snake->increaseScore(Point::PRICE);
                }
            }

            if ($point->getStatus() &&
                $point->getX() ** 2 + $point->getY() ** 2 >= $this->wallRadius ** 2)
            {
                $this->pointService->clearPoint($point);
            }
        }
    }

    private function checkSnakeDeath(Snake $snake): void
    {
        if ($snake->getAliveStatus())
        {
            return;
        }
        unset($this->snakes[$snake->getId()]);
    }

    private function compressWall(): void
    {
        if ($this->wallRadius > self::MIN_WALL_RADIUS)
        {
            $this->wallRadius -= self::COMPRESSION;
        }
    }
}
