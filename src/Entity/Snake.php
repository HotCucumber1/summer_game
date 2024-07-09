<?php

namespace App\Entity;

class Snake
{
    public function __construct(
        private int       $id,
        private float       $headX,
        private float       $headY,
        private array     $bodyParts,
        private int       $radius,
        private Direction $direction,
        private int       $score,
        private string    $color,
        private bool      $isAlive=true
    )
    {
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getHeadX(): float
    {
        return $this->headX;
    }

    public function getHeadY(): float
    {
        return $this->headY;
    }

    /**
     * @return BodyPart[]
     */
    public function getBodyParts(): array
    {
        return $this->bodyParts;
    }

    public function getRadius(): int
    {
        return $this->radius;
    }

    public function getDirection(): Direction
    {
        return $this->direction;
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
        return count($this->bodyParts) + 1; // + head
    }

    public function setHeadX(float $headX): void
    {
        $this->headX = $headX;
    }

    public function setHeadY(float $headY): void
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

    public function setDirection(Direction $direction): void
    {
        $this->direction = $direction;
    }

    public function setColor(string $color): void
    {
        $this->color = $color;
    }

    public function setAliveStatus(bool $isAlive): void
    {
        $this->isAlive = $isAlive;
    }

    public function increaseScore(int $add): void
    {
        $this->score += $add;
    }

    public function addBodyPart(float $x, float $y, string $color): void
    {
        $this->bodyParts[] = new BodyPart($x, $y,
                                          $this->getRadius(),
                                          $color);
    }

    public function deleteLastBodyPart(): void
    {
        $body = $this->getBodyParts();
        array_pop($body);
    }
}
