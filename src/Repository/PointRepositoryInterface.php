<?php

namespace App\Repository;

use App\Entity\Point;

interface PointRepositoryInterface
{
    public function addPoint(Point $point): void;

    /**
     * @return Point[]
     */
    public function findPoints(): array;
    public function clearAllPoints(): void;
}