<?php

namespace App\Service;

use App\Entity\Point;
use App\Entity\Snake;

interface CollisionServiceInterface
{
    public function isSnakeBump(Snake $snake): bool;

    public function isWallBump(Snake $snake): bool;

    public function isPointEaten(Snake $snake, Point $point): bool;
}
