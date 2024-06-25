<?php

namespace App\Entity;

class Snake
{
    public function __construct(
        private int $headX,
        private int $headY,
        private array $bodyParts,
        private int $radius,
        private Direction $speed
    )
    
    {
    }

    public function getHeadX(): int
    {
        return $this->headX;
    }

    public function getHeadY(): int
    {
        return $this->headY;
    }

    public function getBodyParts(): array
    {
        return $this->bodyParts;
    }

    public function getRadius(): int
    {
        return $this->radius;
    }

    public function getSpeed(): Direction
    {
        return $this->speed;
    }

    public function setHeadX(int $headX): void
    {
        $this->headX = $headX;
    }

    public function setHeadY(int $headY): void
    {
        $this->headY = $headY;
    }

    public function setBodyParts(array $bodyParts): void
    {
        $this->bodyParts = $bodyParts;
    }

    public function setRadius(int $radius): void
    {
        $this->radius = $radius;
    }

    public function setSpeed(Direction $speed): void
    {
        $this->speed = $speed;
    }
}
