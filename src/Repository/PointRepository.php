<?php

namespace App\Repository;

use App\Entity\Point;
use App\Entity\Wall;
use Config\Config;

class PointRepository
{
    public static array $points = [];

    public function __construct()
    {
    }

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

        self::$points[] = new Point($x, $y, $color);
    }

    /**
     * @return Point[]
     */
    public function findPoints(): array
    {
        return self::$points;
    }

    public function eatPoint(Point $point): void
    {
        $point->setStatus(false);
    }

    public function deleteEatenPoints(): void
    {
        self::$points = array_filter(self::$points, function ($point)
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