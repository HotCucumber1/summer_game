<?php

namespace App\Entity;

class Snake
{
    public function __construct(
        private ?int $id,
        private int $headX,
        private int $headY,
        private array $bodyParts,
        private int $radius,
        private Direction $speed,
        private int $score,
        private string $color,
        private bool $isAlive = true
    )
    {
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
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

    public function getScore(): int
    {
        return $this->score;
    }

    public function getColor(): string
    {
        return $this->color;
    }

    public function getAliveStatus(): bool
    {
        return $this->isAlive;
    }

    public function getLength(): int
    {
        return count($this->bodyParts) + 1;
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

    public function setColor(string $color): void
    {
        $this->color = $color;
    }

    public function increaseScore(int $add): void
    {
        $this->score += $add;
    }

    public function setAliveStatus(bool $isAlive): void
    {
        $this->isAlive = $isAlive;
    }

    public function addBodyPart(int $x, int $y, string $color): void
    {
        $this->bodyParts[] = new BodyPart($x, $y, $this->getRadius(), $color);
    }

    public function deleteLastBodyPart(): void
    {
        $body = $this->getBodyParts();
        array_pop($body);
    }
}
