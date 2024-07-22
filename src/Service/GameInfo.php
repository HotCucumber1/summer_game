<?php

namespace App\Service;

use App\Entity\Point;
use App\Entity\Snake;
use App\Entity\Wall;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class GameInfo
{
    private const START_POINTS_AMOUNT = 2000;
    private const MIN_WALL_RADIUS = 500;
    private const COMPRESSION = 1;
    private const POINT_CHECK_DISTANCE = 20;
    /**
     * @var Snake[]
     */
    public array $snakes = [];
    private int $wallRadius = Wall::START_RADIUS;
    public bool $isStart = false;

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
                                          $data['snake']['color']);

        $this->checkBumps($snake);
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
                    'color' => $point->getColor()
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

    private function checkBumps(Snake $snake): void
    {
        if (!$snake->getAliveStatus())
        {
            return;
        }
        if ($this->collisionService->isWallBump($snake, $this->wallRadius) ||
            $this->collisionService->isSnakeBump($snake, $this->snakes))
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
        // $this->pointService->clearEatenPoints();
    }

    private function checkSnakeDeath(Snake $snake): void
    {
        if (!$snake->getAliveStatus())
        {
            return;
        }

        $score = $snake->getScore();
        $user = $this->userService->getUserByName($snake->getName());

        if ($score > $user->getScore())
        {
            $this->userService->setUserScore($user->getUserId(), $score);
        }

        $body = $snake->getBodyParts();
        $pointsPerPart = intdiv($score, count($body) + 1);

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

    private function compressWall(): void
    {
        if ($this->wallRadius > self::MIN_WALL_RADIUS)
        {
            $this->wallRadius -= self::COMPRESSION;
        }
    }
}