<?php

namespace App\Repository;

use App\Entity\Point;

interface PointRepositoryInterface
{

    public function addPoint(int $minX, int $minY,
                             int $maxX, int $maxY): void;

    /**
     * @return Point[]
     */
    public function findPoints(): array;

    public function eatPoint(Point $point): void;
    public function deleteAllPoints(): void;

    public function deleteEatenPoints(): void;

    public function getPointColor(): string;
}