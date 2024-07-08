<?php

namespace App\Repository;

use App\Entity\Snake;

class SnakeRepository implements SnakeRepositoryInterface
{
    private array $snakes = [];

    public function storeSnake(Snake $snake, int $id): void
    {
        if (!key_exists($id, $this->snakes))
        {
            $this->snakes[$id] = $snake;
        }
    }

    public function getSnakeById(int $id): Snake
    {
        return $this->snakes[$id];
    }

    public function getSnakes(): array
    {
        return $this->snakes;
    }
}