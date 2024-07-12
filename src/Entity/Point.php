<?php

namespace App\Entity;

class Point
{
    public const PRICE = 1;
    public function __construct(private int    $x,
                                private int    $y,
                                private string $color,
                                private bool   $status = true)
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

    public function getStatus(): bool
    {
        return $this->status;
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

    public function setStatus(bool $status): void
    {
        $this->status = $status;
    }
}
