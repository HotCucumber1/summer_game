<?php

namespace App\Entity;

class BodyPart
{
    public function __construct(private int $x,
                                private int $y,
                                private int $radius,
                                private string $color)
    {
    }

    public function getX(): int
    {
        return $this->x;
    }

    public function getY(): int
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

    public function setX(int $x): void
    {
        $this->x = $x;
    }

    public function setY(int $y): void
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