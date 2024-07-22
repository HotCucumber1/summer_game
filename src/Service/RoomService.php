<?php

namespace App\Service;

use App\Factory\GameFactory;

class RoomService
{
    public function __construct(private readonly GameFactory $gameFactory)
    {
    }

    public function createRoom(): GameInfo
    {
        return $this->gameFactory->createGame();
    }
}