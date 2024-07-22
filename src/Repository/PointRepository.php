<?php

namespace App\Repository;

use App\Entity\Color;
use App\Entity\Point;

class PointRepository implements PointRepositoryInterface
{
    private array $points = [];

    public function addPoint(Point $point): void
    {
        $this->points[] = $point;
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