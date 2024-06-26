<?php

namespace App\Service;

use App\Entity\Snake;
use App\Entity\Wall;

class CollisionService
{
    public function __construct()
    {
    }

    public function isWallBump(Snake $snake): bool
    {
        $snakeX = $snake->getHeadX();
        $snakeY = $snake->getHeadY();
        $snakeR = $snake->getRadius();

        $dist = sqrt(($snakeX - Wall::X) * ($snakeX - Wall::X) + ($snakeY - Wall::Y) * ($snakeY - Wall::Y));
        $sin = $snakeY / $dist;
        $cos = $snakeX / $dist;

        $bumpX = abs($snakeX) + $snakeR * abs($cos);
        $bumpY = abs($snakeY) + $snakeR * abs($sin);

        if ($bumpX * $bumpX + $bumpY * $bumpY >= Wall::RADIUS ** Wall::RADIUS)
        {
            return true;
        }
        return false;
    }
}