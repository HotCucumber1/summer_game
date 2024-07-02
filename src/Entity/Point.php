<?php

namespace App\Entity;

class Point
{
    const PRICE = 1;
    public function __construct(
        private int $coordX,
        private int $coordY,
        private string $color,
        private bool $status = true
    )
    {
    }

    public function getCoordX(): int
    {
        return $this->coordX;
    }

    public function getCoordY(): int
    {
        return $this->coordY;
    }

    public function getColor(): string
    {
        return $this->color;
    }

    public function getStatus(): bool
    {
        return $this->status;
    }

    public function setCoordX(int $coordX): void
    {
        $this->coordX = $coordX;
    }

    public function setCoordY(int $coordY): void
    {
        $this->coordY = $coordY;
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
