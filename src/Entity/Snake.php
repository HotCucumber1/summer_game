<?php

namespace App\Entity;

class Snake
{
    private const START_RADIUS = 15;
    private const START_SCORE = 0;
    private int $radius;
    private int $score;
    private string $color;

    public function __construct(private ?int   $id,
                                private string $name,
                                private int    $headX,
                                private int    $headY,
                                private array  $bodyParts,
                                private bool   $isAlive=true,
                                private bool   $boost=false,
                                private float  $angle=M_PI / 2)
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

    public function getHeadX(): int
    {
        return $this->headX;
    }

    public function getHeadY(): int
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

    public function getBoost(): bool
    {
        return $this->boost;
    }

    public function getAngle(): float
    {
        return $this->angle;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
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

    public function setColor(string $color): void
    {
        $this->color = $color;
    }

    public function setAliveStatus(bool $isAlive): void
    {
        $this->isAlive = $isAlive;
    }

    public function setBoost(bool $boost): void
    {
        $this->boost = $boost;
    }

    public function setAngle(float $angle): void
    {
        $this->angle = $angle;
    }

    public function increaseScore(int $add): void
    {
        $this->score += $add;
    }
}
