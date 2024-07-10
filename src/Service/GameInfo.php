<?php

namespace App\Service;

use App\Entity\BodyPart;
use App\Entity\Point;
use App\Entity\Snake;
use App\Entity\Wall;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class GameInfo
{
    const START_POINTS_AMOUNT = 1000;
    const DEFAULT_ROTATION_ANGLE = M_PI / 32;
    private Snake $snake;
    private array $users_data = [];

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

    public function setGameStatus(string $jsonData): void
    {
        $data = json_decode($jsonData, associative: true);
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

        $this->snakeService->setSnakeData($this->snake,
                                          $data['snake']['x'],
                                          $data['snake']['y'],
                                          $data['snake']['radius'],
                                          $this->snake->getColor(),
                                          $data['snake']['body']);
        $this->checkBumps();
        $this->updatePoints();
        $this->checkSnakeDeath();
        $this->compressWall();
    }

    public function getData(): array
    {
        // пока текущая змея
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
                    'x' => $point->getX(),
                    'y' => $point->getY(),
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
        ];
    }

    private function checkBumps(): void
    {
        if ($this->collisionService->isWallBump($this->snake) ||
            $this->collisionService->isSnakeBump($this->snake))
        {
            // TODO: закоментировонно для отладки
            $this->snakeService->die($this->snake);
            /*$id = SessionService::takeUserIdFromSession();
            $score = $this->snake->getScore();

            $this->userService->setUserScore($id, $score);*/
        }
    }

    private function updatePoints(): void
    {
        $points = $this->pointService->allPoints();
        foreach ($points as $point)
        {
            if (abs($this->snake->getHeadX() - $point->getX()) < 20 &&
                abs($this->snake->getHeadY() - $point->getY()) < 20)
            {
                if ($this->collisionService->isPointEaten($this->snake, $point))
                {
                    $this->pointService->clearPoint($point);
                    $this->snake->increaseScore(Point::PRICE);
                    var_dump('eaten');
                }
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
        if (Wall::$radius > 500)
        {
            Wall::$radius -= 1;
        }
    }
}