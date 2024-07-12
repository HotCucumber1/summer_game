<?php

namespace App\Service;

use App\Entity\Point;
use App\Entity\Snake;
use App\Entity\Wall;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class GameInfo
{
    private const START_POINTS_AMOUNT = 2000;
    private ?Snake $snake;
    /**
     * @var Snake[]
     */
    public array $users;

    public function __construct(private readonly CollisionServiceInterface $collisionService,
                                private readonly PointService              $pointService,
                                private readonly SnakeService              $snakeService,
                                private readonly UserService               $userService)
    {
        $this->snake = $this->snakeService->createSnake(0);

        for ($i = 0; $i < self::START_POINTS_AMOUNT; $i++)
        {
            $this->pointService->addPoint(-Wall::$radius, -Wall::$radius,
                Wall::$radius, Wall::$radius);
        }
        $this->users = [];
    }

    public function addUserToGame(int $id): void
    {
        if (!isset($this->users[$id]))
        {
            $this->users[$id] = $this->snakeService->createSnake($id);
        }
    }

    public function dropGameToStart(): void
    {
        if ($this->snake !== null)
        {
            return;
        }

        $this->users = [];
        Wall::$radius = Wall::START_RADIUS;
        $this->pointService->clearAllPoints();
        $this->snake = $this->snakeService->createSnake(0);

        for ($i = 0; $i < self::START_POINTS_AMOUNT; $i++)
        {
            $this->pointService->addPoint(-Wall::$radius, -Wall::$radius,
                                            Wall::$radius, Wall::$radius);
        }
    }

    public function setGameStatus(string $jsonData, int $id): void
    {
        //$snake = $this->users[$id];
        $snake = $this->snake;
        if ($snake === null)
        {
            return;
        }
        $data = json_decode($jsonData, true, 512, JSON_THROW_ON_ERROR);
        if (!isset($data['snake']) ||
            !isset($data['snake']['id']) ||
            !isset($data['snake']['x']) ||
            !isset($data['snake']['y']) ||
            !isset($data['snake']['radius']) ||
            !isset($data['snake']['score']) ||
            !isset($data['snake']['body']))
        {
            throw new BadRequestException('Not enough information about snake');
        }


        $this->snakeService->setSnakeData($snake,
                                          $data['snake']['x'],
                                          $data['snake']['y'],
                                          $data['snake']['radius'],
                                          $snake->getColor(),
                                          $data['snake']['body']);

        $this->checkBumps($snake);
        $this->updatePoints($snake);
        $this->checkSnakeDeath($snake);
        $this->compressWall();
    }

    public function getData(): array
    {
        // пока текущая змея
        $snake = $this->getCurrentSnake();
        //$snake = $this->users[$id];
        $snakeData = [];
        if ($snake !== null)
        {
            $snakeData = $this->snakeService->getSnakeData($snake);
        }

        // Информация по точкам
        $points = $this->pointService->allPoints();
        $pointsData = [];
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

        // информация по другим игроквм
        $userData = [];
        foreach ($this->users as $user)
        {
            $userData[] = $this->snakeService->getSnakeData($user);
        }

        return [
            'snake' => $snakeData,
            'points' => $pointsData,
            'wall' => Wall::$radius,
            'users' => $userData
        ];
    }

    public function deleteUser(int $id): void
    {
        unset($this->users[$id]);
    }


    private function checkBumps(?Snake $snake): void
    {
        //$snake = $this->getCurrentSnake();
        if ($snake === null)
        {
            return;
        }
        if ($this->collisionService->isWallBump($snake) ||
            $this->collisionService->isSnakeBump($snake))
        {
            $snake->setAliveStatus(false);
        }
    }

    private function updatePoints(?Snake $snake): void
    {
        //$snake = $this->getCurrentSnake();
        if ($snake === null)
        {
            return;
        }
        $points = $this->pointService->allPoints();
        foreach ($points as $point)
        {
            if (abs($snake->getHeadX() - $point->getX()) < 20 &&
                abs($snake->getHeadY() - $point->getY()) < 20)
            {
                if ($this->collisionService->isPointEaten($snake, $point))
                {
                    $this->pointService->clearPoint($point);
                    $snake->increaseScore(Point::PRICE);
                }
            }

            if ($point->getX() ** 2 + $point->getY() ** 2 >= Wall::$radius ** 2)
            {
                $this->pointService->clearPoint($point);
            }
        }
        $this->pointService->clearEatenPoints();
    }

    private function checkSnakeDeath(?Snake $snake): void
    {
        //$snake = $this->getCurrentSnake();
        if ($snake === null)
        {
            return;
        }
        if (!$snake->getAliveStatus())
        {
            $score = $snake->getScore();

            // $id = SessionService::takeUserIdFromSession();
            // $this->userService->setUserScore($id, $score);

            $body = $snake->getBodyParts();
            $this->snake = null;
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
        if (Wall::$radius > 500)
        {
            Wall::$radius -= 2;
        }
    }

    private function getCurrentSnake(): ?Snake
    {
        //$id = SessionService::takeUserIdFromSession();
        //return $this->users[$id];
        return $this->snake;
    }
}