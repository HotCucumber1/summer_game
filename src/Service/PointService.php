<?php

namespace App\Service;

use App\Entity\Point;
use App\Repository\PointRepository;


class PointService
{
    public function __construct(private readonly PointRepository $pointRepository)
    {
    }

    public function addPoint(int $x1, int $y1,
                             int $x2, int $y2): void
    {
        $this->pointRepository->addPoint($x1, $y1, $x2, $y2);
    }

    public function clearPoint(Point $point): void
    {
        $this->pointRepository->eatPoint($point);
    }

    public function clearEatenPoints(): void
    {
        $this->pointRepository->deleteEatenPoints();
    }

    public function allPoints(): ?array
    {
        return $this->pointRepository->findPoints();
    }
}