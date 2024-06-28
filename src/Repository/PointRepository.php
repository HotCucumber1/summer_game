<?php

namespace App\Repository;

use App\Entity\Point;
use config\Config;
use Ds\Set;

class PointRepository
{
    public static array $points = [];

    public function __construct()
    {
    }

    public function addPoint(int $minX, int $minY,
                             int $maxX, int $maxY): void
    {
        $x = rand($minX, $maxX);
        $y = rand($minY, $maxY);
        $color = $this->getPointColor();

        self::$points[] = new Point($x, $y, $color);
    }

    public function findPoints(): ?array
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