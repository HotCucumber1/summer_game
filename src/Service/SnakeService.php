<?php

namespace App\Service;
use App\Entity\BodyPart;
use App\Entity\Direction;
use App\Entity\Snake;
use App\Repository\SnakeRepositoryInterface;
use Config\Config;

class SnakeService
{
    //const START_X = 10;
    //const START_Y = 10;
    const START_RADIUS = 15;
    const START_SCORE = 0;
    const START_LENGTH = 10;
    const START_SPEED = 5;
    const START_ANGLE = M_PI / 2;
    const START_X = 1152;  // в идеале нужно рандом (для одной можно центр канваса) // canvas.width / 2
    const START_Y = 535;   // в идеале нужно рандом (для одной можно центр канваса) // canvas.height / 2

    public function __construct(private SnakeRepositoryInterface $snakeRepository)
    {
    }

    public function createSnake(): Snake
    {
        $startDirection = new Direction(self::START_SPEED ,
                                        self::START_ANGLE);
        $color = Config::COLORS[array_rand(Config::COLORS)];

        $startBody = $this->createBody($color);
        // $id = SessionService::takeUserIdFromSession();
        $id = 0;
        return new Snake($id,
                         self::START_X,
                         self::START_Y,
                         $startBody,
                         self::START_RADIUS,
                         $startDirection,
                         self::START_SPEED,
                         self::START_SCORE,
                         $color);
    }

    /**
     * @return array<int, Snake>
     */
    public function getSnakes(): array
    {
        return $this->snakeRepository->getSnakes();
    }

    public function move(Snake $snake): void
    {
        $lastX = $snake->getHeadX();
        $lastY = $snake->getHeadY();

        $speed = $snake->getDirection()->getSpeed();
        $angle = $snake->getDirection()->getAngle();

        $x = $lastX + $speed * cos($angle);
        $y = $lastY + $speed * sin($angle);

        $snake->setHeadX($x);
        $snake->setHeadY($y);

        // $body = $snake->getBodyParts();
        $this->moveBody($snake, $lastX, $lastY);
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

    private function createBody(string $color): array
    {
        // TODO: протестить создание
        $body = [];
        for ($i = 0; $i < self::START_LENGTH; $i++)
        {
            $body[] = new BodyPart(self::START_X,
                                  self::START_Y,
                                  self::START_RADIUS,
                                  $color);
        }
        return $body;
    }

    private function moveBody(Snake $snake, int $x, int $y): void
    {
        // TODO: протестить передвижение
        /*$last = end($body);

        $last->setX($x);
        $last->setY($y);
        */

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
        $snake->setRadius($snake->getRadius() + 1);

        $body = $snake->getBodyParts();
        foreach ($body as $bodyPart)
        {
            $radius = $bodyPart->getRadius();
            $bodyPart->setRadius($radius + 1);
        }
    }

    private function decreaseLength(Snake $snake): void
    {
        $snake->deleteLastBodyPart();
    }

    private function decreaseRadius(Snake $snake): void
    {
        $body = $snake->getBodyParts();
        foreach ($body as $bodyPart)
        {
            $radius = $bodyPart->getRadius();
            $bodyPart->setRadius($radius - 1);
        }
    }
}