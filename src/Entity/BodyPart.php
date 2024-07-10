<?php

namespace App\Entity;

class BodyPart
{
    public function __construct(private float $x,
                                private float $y,
                                private int $radius,
                                private string $color)
    {
    }

    public function getX(): float
    {
        return $this->x;
    }

    public function getY(): float
    {
        return $this->y;
    }

    public function getColor(): string
    {
        return $this->color;
    }

    public function getRadius(): int
    {
        return $this->radius;
    }

    public function setX(float $x): void
    {
        $this->x = $x;
    }

    public function setY(float $y): void
    {
        $this->y = $y;
    }

    public function setColor(string $color): void
    {
        $this->color = $color;
    }

    public function setRadius(int $radius): void
    {
        $this->radius = $radius;
    }
}