<?php

namespace App\Service;

use App\Entity\BodyPart;
use App\Entity\Point;
use App\Entity\Snake;
use App\Entity\SnakeBot;
use App\Entity\Wall;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class GameInfo
{
    private const SPAWN_ZONE = 0.6;
    private const START_POINTS_AMOUNT = 2000;
    private ?Snake $snake;
    private const START_BOT_NUMBER = 20;
    /**
     * @var SnakeBot[]
     */
    private array $bots = [];

    public function __construct(private readonly CollisionServiceInterface $collisionService,
                                private readonly PointService              $pointService,
                                private readonly SnakeService              $snakeService,
                                private readonly UserService               $userService)
    {
        $this->snake = $this->snakeService->createSnake();
        for ($i = 0; $i < self::START_BOT_NUMBER; $i++)
        {
            $this->bots[] = $this->snakeService->createSnakeBot();
        }
        for ($i = 0; $i < self::START_POINTS_AMOUNT; $i++)
        {
            $this->pointService->addPoint(-Wall::$radius, -Wall::$radius,
                Wall::$radius, Wall::$radius);
        }
    }

    public function dropGameToStart(): void
    {
        if ($this->snake !== null)
        {
            return;
        }
        Wall::$radius = Wall::START_RADIUS;
        $this->pointService->clearAllPoints();
        $this->snake = $this->snakeService->createSnake();

        for ($i = 0; $i < self::START_POINTS_AMOUNT; $i++)
        {
            $this->pointService->addPoint(-Wall::$radius, -Wall::$radius,
                                            Wall::$radius, Wall::$radius);
        }
    }

    public function setGameStatus(string $jsonData): void
    {
        if ($this->snake === null)
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

        $this->snakeService->setSnakeData($this->snake,
                                          $data['snake']['x'],
                                          $data['snake']['y'],
                                          $data['snake']['radius'],
                                          $this->snake->getColor(),
                                          $data['snake']['body']);

        $this->moveBots();
        $this->checkBumps();
        $this->updatePoints();
        $this->checkSnakeDeath();
        $this->compressWall();
    }

    public function getData(): array
    {
        // пока текущая змея
        $snakeData = [];
        if ($this->snake !== null)
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

        // Информация по ботам
        $botsData = [];
        foreach ($this->bots as $bot)
        {
            $body = $bot->getBodyParts();
            $bodyData = [];
            foreach ($body as $bodyPart)
            {
                $bodyData[] = [
                    'x' => $bodyPart->getX(),
                    'y' => $bodyPart->getY(),
                    'color' => $bodyPart->getColor()
                ];
            }

            $botsData[] = [
                'x' => $bot->getHeadX(),
                'y' => $bot->getHeadY(),
                'body' => $bodyData,
                'radius' => $bot->getRadius(),
                'score' => $bot->getScore(),
            ];
        }

        return [
            'snake' => $snakeData,
            'points' => $pointsData,
            'wall' => Wall::$radius,
            'bots' => $botsData,
        ];
    }

    private function moveBots(): void
    {
        foreach ($this->bots as $bot)
        {
            $this->snakeService->move($bot);
        }
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
        if ($this->snake === null)
        {
            return;
        }
        if ($this->collisionService->isWallBump($this->snake) ||
            $this->collisionService->isSnakeBump($this->snake))
        {
            $this->snake->setAliveStatus(false);
        }
    }

    private function updatePoints(): void
    {
        if ($this->snake === null)
        {
            return;
        }
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
                    // $this->snakeService->grow($this->snake);
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
}