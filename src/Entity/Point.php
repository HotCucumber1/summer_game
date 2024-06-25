<?php

namespace App\Entity;

class Point
{
    public function __construct(
        private int $coordX,
        private int $coordY,
        private string $color
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
}
