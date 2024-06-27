<?php

namespace App\Service;

use App\Entity\Snake;
use App\Entity\Point;
use App\Entity\Wall;

class CollisionService
{
    public function __construct(private PointService $pointService)
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
    
    public function iSPointEaten(Snake $snake, Point $point): bool
    {
        $headX = $snake->getHeadX();
        $headY = $snake->getHeadY();
        $radius = $snake->getRadius();

        $pointX = $point->getCoordX();
        $pointY = $point->getCoordY();

        // $points = $pointService->getPoints();   // получаем массив точек на поле

        if (($pointX - $headX) ** 2 + ($pointY - $headY) ** 2 <= $radius ** 2) 
        {
            $point->setStatus(false);    // нужно дабавить поле Status в Point (false, если точку нужно удалить из массива)
            return true;
        } else
        {
            return false;
        };

        // for($i = count($points); $i >= 0; $i--)   // возможно нужно перенести в GameInfo
        // {
        //     if (!($points[$i]->getStatus()))
        //     {
        //         unset($points[$i]);
        //     }
        // };

    }
}
