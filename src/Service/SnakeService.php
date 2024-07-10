<?php

namespace App\Service;
use App\Entity\BodyPart;
use App\Entity\Direction;
use App\Entity\Snake;
use App\Entity\SnakeBot;
use App\Entity\Wall;
use App\Repository\SnakeRepositoryInterface;
use Config\Config;

class SnakeService
{
    private const START_RADIUS = 15;
    private const START_SCORE = 20;
    private const START_LENGTH = 10;
    public const START_SPEED = 3;
    public const BOOST_SPEED = 10;
    private const START_ANGLE = M_PI / 2;
    private const SPAWN_ZONE = 0.6;
    private const BOT_VISION = 300;

    public function __construct(private readonly SnakeRepositoryInterface $snakeRepository)
    {
    }

    public function createSnake(): Snake
    {
        $color = Config::COLORS[array_rand(Config::COLORS)];

        // $id = SessionService::takeUserIdFromSession();
        $id = 0;
        do
        {
            $headX = rand(-self::SPAWN_ZONE * Wall::$radius, self::SPAWN_ZONE * Wall::$radius);
            $headY = rand(-self::SPAWN_ZONE * Wall::$radius, self::SPAWN_ZONE * Wall::$radius);
        }
        while ($headX ** 2 + $headY ** 2 >= (self::SPAWN_ZONE * Wall::$radius) ** 2);

        $startBody = $this->createBody($color, $headX, $headY);
        return new Snake($id,
                         $headX,
                         $headY,
                         $startBody,
                         self::START_RADIUS,
                         self::START_SCORE,
                         $color);
    }

    public function createSnakeBot(): SnakeBot
    {
        $color = Config::COLORS[array_rand(Config::COLORS)];

        // $id = SessionService::takeUserIdFromSession();
        $id = 0;
        do
        {
            $headX = rand(-self::SPAWN_ZONE * Wall::$radius, self::SPAWN_ZONE * Wall::$radius);
            $headY = rand(-self::SPAWN_ZONE * Wall::$radius, self::SPAWN_ZONE * Wall::$radius);
        }
        while ($headX ** 2 + $headY ** 2 >= (self::SPAWN_ZONE * Wall::$radius) ** 2);

        $startBody = $this->createBody($color, $headX, $headY);
        return new SnakeBot($id,
            $headX,
            $headY,
            $startBody,
            self::START_RADIUS,
            self::START_SCORE,
            $color);
    }

    public function setSnakeData(Snake $snake,
                                 int $x,
                                 int $y,
                                 int $radius,
                                 string $color,
                                 array $oldSnakeBody): void
    {
        $snake->setHeadX($x);
        $snake->setHeadY($y);
        $snake->setRadius($radius);

        $newBody = [];
        foreach ($oldSnakeBody as $bodyPart)
        {
            $newBody[] = new BodyPart($bodyPart['x'],
                                      $bodyPart['y'],
                                      $radius,
                                      $color);
        }
        $snake->setBodyParts($newBody);
    }

    /**
     * @return array<int, Snake>
     */
    public function getSnakes(): array
    {
        return $this->snakeRepository->getSnakes();
    }

    public function grow(Snake $snake): void
    {
        $this->increaseLength($snake);
        $this->increaseRadius($snake);
    }

    public function decline(Snake $snake): void
    {
        $this->decreaseLength($snake);
        $this->decreaseRadius($snake);
    }

    public function die(Snake $snake): void
    {
        $snake->setAliveStatus(false);
    }

    public function botFindFood(SnakeBot $bot, array $food): void
    {
        if ($bot->avoidSnake || $bot->border)
        {
            return;
        }
        $min = 10000;
        foreach ($food as $point)
        {
            $minCoordsX = $point->getX;
            $minCoordsY = $point->getY;
            $dist = ($minCoordsX - $bot->getHeadX()) ** 2 + ($minCoordsY - $bot->getHeadY()) ** 2;
            if ($dist < $min && $dist < 500 ** 2)
            {
                $min = (int) sqrt($dist);
            }
        }
        if (isset($minCoordsX, $minCoordsY) && $min < 10000)
        {
            $this->rotateBotToTarget($bot, $minCoordsX, $minCoordsY);
        }
    }

    public function botCheckPlayer(SnakeBot $bot, Snake $player): void
    {
        if ($bot->border)
        {
            return;
        }
        if (abs($player->getHeadX() - $bot->getHeadX()) < self::BOT_VISION)
        {
            $this->rotateBotToTarget($bot, $bot->getHeadX(), $bot->getHeadY());
            $bot->avoidSnake = true;
        }
        else
        {
            $bot->avoidSnake = false;
        }
    }

    private function rotateBotToTarget(SnakeBot $bot, int $x, int $y): void
    {
        $epsilon = 0.0001; // Допустимая погрешность
        $targetAngle = atan2($y, $x);
        $angle = $bot->getDirection()->getAngle();

        while (abs($angle - $targetAngle) > $epsilon)
        {
            if ($angle < $targetAngle)
            {
                $angle += M_PI / 32;
            }
            else
            {
                $angle -= M_PI / 32;
            }
            // Нормализуем угол в диапазоне от -π до π
            if ($angle > M_PI)
            {
                $angle -= 2 * M_PI;
            }
            elseif ($angle < -M_PI)
            {
                $angle += 2 * M_PI;
            }
        }

        // Вычисляем новые координаты после поворота
        $bot->setDirection(
            new Direction(
                $bot->getDirection()->getSpeed(), $angle
            )
        );
    }

    public function move(SnakeBot $snake): void
    {
        $lastX = $snake->getHeadX();
        $lastY = $snake->getHeadY();

        $speed = $snake->getDirection()->getSpeed();
        $angle = $snake->getDirection()->getAngle();

        $x = $lastX + $speed * cos($angle);
        $y = $lastY + $speed * sin($angle);

        $snake->setHeadX($x);
        $snake->setHeadY($y);

        $this->moveBody($snake, $lastX, $lastY);
    }

    private function moveBody(SnakeBot $snake, int $x, int $y): void
    {
        // TODO: протестить передвижение

        $body = $snake->getBodyParts();
        $angle = $snake->getDirection()->getAngle();
        $halfRadius = self::START_RADIUS / 2;

        foreach ($body as $bodyPart)
        {
            $lastX = $bodyPart->getX() - $halfRadius * cos($angle);
            $lastY = $bodyPart->getY() - $halfRadius * sin($angle);

            $bodyPart->setX($x);
            $bodyPart->setY($y);

            $x = $lastX;
            $y = $lastY;
        }
    }

    private function increaseLength(Snake $snake): void
    {
        $body = $snake->getBodyParts();
        $lastBodyPart = end($body);

        $snake->addBodyPart($lastBodyPart->getX(),
            $lastBodyPart->getY(),
            $snake->getColor());
    }

    private function increaseRadius(Snake $snake): void
    {
        $newRadius = $snake->getRadius() + 1;
        $snake->setRadius($newRadius);

        $body = $snake->getBodyParts();
        foreach ($body as $bodyPart)
        {
            $bodyPart->setRadius($newRadius);
        }
    }

    private function decreaseLength(Snake $snake): void
    {
        $snake->deleteLastBodyPart();
    }

    private function decreaseRadius(Snake $snake): void
    {
        $newRadius = $snake->getRadius() - 1;
        $body = $snake->getBodyParts();
        foreach ($body as $bodyPart)
        {
            $bodyPart->setRadius($newRadius);
        }
    }

    private function createBody(string $color, float $x, float $y): array
    {
        $body = [];
        for ($i = 0; $i < self::START_LENGTH; $i++)
        {
            $body[] = new BodyPart($x, $y,
                                  self::START_RADIUS,
                                  $color);
        }
        return $body;
    }
}