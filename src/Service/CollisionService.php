<?php

namespace App\Service;

use App\Entity\Snake;
use App\Entity\Point;

class CollisionService
{
    public function __construct(private PointService $pointService)
    {
    }

    public function iSPointEaten(Snake $snake, Point $point)
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
