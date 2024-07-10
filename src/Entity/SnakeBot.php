<?php

namespace App\Entity;

class SnakeBot extends Snake
{
    private Direction $direction;
    private const BOT_SPEED = 4;

    public bool $border;
    public bool $avoidSnake;

    public function __construct(int    $id,
                                float  $headX,
                                float  $headY,
                                array  $bodyParts,
                                int    $radius,
                                int    $score,
                                string $color,
                                bool   $isAlive = true)
    {
        parent::__construct($id, $headX, $headY, $bodyParts, $radius, $score, $color, $isAlive);
        $this->direction = new Direction(self::BOT_SPEED, (2 * M_PI) / random_int(1, 1000));
        $this->avoidSnake = false;
        $this->border = false;
    }


    /**
     * @return Direction
     */
    public function getDirection(): Direction
    {
        return $this->direction;
    }

    /**
     * @param Direction $direction
     */
    public function setDirection(Direction $direction): void
    {
        $this->direction = $direction;
    }
}