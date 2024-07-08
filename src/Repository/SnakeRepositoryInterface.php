<?php

namespace App\Repository;

use App\Entity\Snake;

interface SnakeRepositoryInterface
{
    public function storeSnake(Snake $snake, int $id): void;
    public function getSnakeById(int $id): Snake;

    /**
     * @return Snake[]
     */
    public function getSnakes(): array;
}