<?php

namespace App\Entity;

class Direction
{
    public function __construct(
        private int $speed,
        private float $angle
    )
    {
    }

    public function getSpeed(): int
    {
        return $this->speed;
    }

    public function getAngle(): float
    {
        return $this->angle;
    }

    public function setSpeed(int $speed): void
    {
        $this->speed = $speed;
    }

    public function setAngle(float $angle): void
    {
        $this->angle = $angle;
    }
}
