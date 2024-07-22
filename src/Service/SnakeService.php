<?php

namespace App\Service;

use App\Entity\BodyPart;
use App\Entity\Color;
use App\Entity\Snake;
use App\Entity\Wall;

class SnakeService
{
    private const START_RADIUS = 15;
    private const START_LENGTH = 10;
    private const SPAWN_ZONE = 0.6;

    public function createSnake(int $id, string $name): Snake
    {
        $color = Color::getRandomColor();

        do
        {
            $headX = rand(-self::SPAWN_ZONE * Wall::START_RADIUS, self::SPAWN_ZONE * Wall::START_RADIUS);
            $headY = rand(-self::SPAWN_ZONE * Wall::START_RADIUS, self::SPAWN_ZONE * Wall::START_RADIUS);
        }
        while ($headX ** 2 + $headY ** 2 >= (self::SPAWN_ZONE * Wall::START_RADIUS) ** 2);

        $startBody = $this->createBody($color, $headX, $headY);
        return new Snake($id,
                         $name,
                         $headX,
                         $headY,
                         $startBody);
    }

    public function setSnakeData(Snake $snake,
                                 int $x,
                                 int $y,
                                 int $radius,
                                 array $oldSnakeBody,
                                 string $color,
                                 bool $boost): void
    {
        $snake->setHeadX($x);
        $snake->setHeadY($y);
        $snake->setRadius($radius);
        $snake->setColor($color);
        $snake->setBoost($boost);

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

    public function getSnakeData(Snake $snake): array
    {
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

        return [
            'id' => $snake->getId(),
            'name' => $snake->getName(),
            'x' => $snake->getHeadX(),
            'y' => $snake->getHeadY(),
            'body' => $bodyData,
            'radius' => $snake->getRadius(),
            'score' => $snake->getScore(),
            'color' => $snake->getColor(),
            'boost' => $snake->getBoost(),
        ];
    }

    private function createBody(string $color, int $x, int $y): array
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