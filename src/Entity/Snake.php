<?php

namespace App\Entity;

class Snake
{
    private const START_RADIUS = 15;
    private const START_SCORE = 0;
    private int $radius;
    private int $score;
    private string $color;

    public function __construct(private int    $id,
                                private float  $headX,
                                private float  $headY,
                                private array  $bodyParts,
                                private bool   $isAlive=true)
    {
        $this->radius = self::START_RADIUS;
        $this->score = self::START_SCORE;
        $this->color = Color::getRandomColor();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
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

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
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
