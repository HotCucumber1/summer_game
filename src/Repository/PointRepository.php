<?php

namespace App\Repository;

use App\Entity\Point;
use App\Entity\Wall;
use Config\Config;

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
        while ($x ** 2 + $y ** 2 >= Wall::$radius ** 2);
        $color = $this->getPointColor();

        $this->points[] = new Point($x, $y, $color);
    }

    /**
     * @return Point[]
     */
    public function findPoints(): array
    {
        return $this->points;
    }

    public function eatPoint(Point $point): void
    {
        $point->setStatus(false);
    }

    public function deleteAllPoints(): void
    {
        $this->points = [];
    }

    public function deleteEatenPoints(): void
    {
        $this->points = array_filter($this->points, function ($point)
        {
            return $point->getStatus();
        });
    }

    public function getPointColor(): string
    {
        $key = array_rand(Config::COLORS);
        return Config::COLORS[$key];
    }
}