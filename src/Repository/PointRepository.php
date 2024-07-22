<?php

namespace App\Repository;

use App\Entity\Color;
use App\Entity\Point;

class PointRepository implements PointRepositoryInterface
{
    private array $points = [];

    public function addPoint(int $minX, int $minY,
                             int $maxX, int $maxY): void
    {
        do
        {
            $x = rand($minX, $maxX);
            $y = rand($minY, $maxY);
        }
        while ($x ** 2 + $y ** 2 >= $maxY ** 2);
        $color = Color::getRandomColor();

        $this->points[] = new Point($x, $y, $color);
    }

    /**
     * @return Point[]
     */
    public function findPoints(): array
    {
        return $this->points;
    }

    public function clearAllPoints(): void
    {
        $this->points = [];
    }
}