<?php

namespace App\Entity;

class Snake
{
    public function __construct(
        private int $headX,
        private int $headY,
        private array $bodyParts,
        private int $radius  // массив объектов-кругов
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

    /**
     * @return int
     */
    public function getRadius(): int
    {
        return $this->radius;
    }

    public function getBodyParts(): array
    {
        return $this->bodyParts;
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

    /**
     * @param int $radius
     */
    public function setRadius(int $radius): void
    {
        $this->radius = $radius;
    }

    public function addBodyPart(int $x, int $y, string $color): void
    {
        $this->bodyParts[] = new BodyPart($x, $y, $this->getRadius(), $color);
    }

    public function removeBodyPart(): void
    {
        $body = $this->getBodyParts();
        array_pop($body);
    }
}
