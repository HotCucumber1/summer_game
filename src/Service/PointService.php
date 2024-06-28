<?php

namespace App\Service;

use App\Entity\Point;
use App\Repository\PointRepository;


class PointService
{
    public function __construct(private PointRepository $pointRepository)
    {
    }

    public function addPoint(): void
    {
        $this->pointRepository->addPoint();
        // TODO: добавить точку к массиву точек в PointRepo->добавить точку
    }

    public function clearPoint(Point $point)
    {
        // TODO: обращаемся к массиву с Точками в PointRepo -> удаляем точку
    }
}
