<?php

namespace App\Service;

use App\Entity\Snake;
use App\Entity\Point;
use App\Entity\Wall;

class CollisionService implements CollisionServiceInterface
{
    public function __construct()
    {
    }

    public function isSnakeBump(Snake $snake): bool
    {
        // TODO: столкновение змей (когда будет мультиплеер)
        return false;
    }

    public function isWallBump(Snake $snake): bool
    {
        $snakeX = $snake->getHeadX();
        $snakeY = $snake->getHeadY();
        $snakeR = $snake->getRadius();

        $dist = sqrt(($snakeX - Wall::centreX) ** 2 + ($snakeY - Wall::centreY) ** 2);
        $sin = $snakeY / $dist;
        $cos = $snakeX / $dist;

        $bumpX = abs($snakeX) + $snakeR * abs($cos);
        $bumpY = abs($snakeY) + $snakeR * abs($sin);

        return ($bumpX ** 2 + $bumpY ** 2 >= Wall::$radius ** 2);
    }    
    
    public function isPointEaten(Snake $snake, Point $point): bool
    {
        $headX = $snake->getHeadX();
        $headY = $snake->getHeadY();
        $radius = $snake->getRadius();

        $pointX = $point->getCoordX();
        $pointY = $point->getCoordY();

        return (($pointX - $headX) ** 2 + ($pointY - $headY) ** 2 <= $radius ** 2);
    }
}
