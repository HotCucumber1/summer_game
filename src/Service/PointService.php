<?php

namespace App\Service;

use App\Entity\Color;
use App\Entity\Point;
use App\Repository\PointRepositoryInterface;


class PointService
{
    public function __construct(private readonly PointRepositoryInterface $pointRepository)
    {
    }

    public function addPoint(int $x1, int $y1,
                             int $x2, int $y2): void
    {
        do
        {
            $x = rand($x1, $x2);
            $y = rand($y1, $y2);
        }
        while ($x ** 2 + $y ** 2 >= $y2 ** 2);
        $point = new Point($x, $y, Color::getRandomColor());
        $this->pointRepository->addPoint($point);
    }

    public function clearPoint(Point $point): void
    {
        $point->setStatus(false);
    }

    public function clearAllPoints(): void
    {
        $this->pointRepository->clearAllPoints();
    }

    /**
     * @return Point[]
     */
    public function allPoints(): array
    {
        return $this->pointRepository->findPoints();
    }
}
