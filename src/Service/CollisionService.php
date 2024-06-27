<?php

namespace App\Service;

use App\Entity\Snake;
use App\Entity\Wall;

class CollisionService
{
    public function __construct()
    {
    }

    public function isSnakeBump(Snake $snake): bool
    {
    }

    public function isWallBump(Snake $snake, Wall $wall): bool
    {
        $snakeX = $snake->getHeadX();
        $snakeY = $snake->getHeadY();
        $snakeR = $snake->getRadius();

        $dist = sqrt(($snakeX - Wall::centreX) ** 2 + ($snakeY - Wall::centreY) * ($snakeY - Wall::centreY));
        $sin = $snakeY / $dist;
        $cos = $snakeX / $dist;

        $bumpX = abs($snakeX) + $snakeR * abs($cos);
        $bumpY = abs($snakeY) + $snakeR * abs($sin);

        if ($bumpX ** 2 + $bumpY ** 2 >= $wall->getRadius() ** 2)
        {
            return true;
        }
        return false;
    }
}