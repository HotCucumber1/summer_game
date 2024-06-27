<?php

namespace App\Entity;

class Wall
{
    const centreX = 0;
    const centreY = 0;
    const START_RADIUS = 1000;

    public function __construct(private int $radius = self::START_RADIUS)
    {
    }

    public function getRadius(): int
    {
        return $this->radius;
    }

    public function setRadius(int $radius): void
    {
        $this->radius = $radius;
    }

    public function increaseRadius(int $div): void
    {
        $this->radius -= $div;
    }
}