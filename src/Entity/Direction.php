<?php

namespace App\Entity;

class Direction
{
    public function __construct(
        private int $directX,
        private int $directY
    )
    {
    }

    public function getDirectX(): int
    {
        return $this->directX;
    }

    public function getDirectY(): int
    {
        return $this->directY;
    }

    public function setDirectX(int $directX): void
    {
        $this->directX = $directX;
    }

    public function setDirectY(int $directY): void
    {
        $this->directY = $directY;
    }

}
