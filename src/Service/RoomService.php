<?php

namespace App\Service;

use App\Factory\GameFactory;
use App\Repository\RoomRepositoryInterface;

class RoomService
{
    public function __construct(private readonly GameFactory $gameFactory,
                                private readonly RoomRepositoryInterface $roomRepository)
    {
    }

    public function addRoom(string $name): GameInfo
    {
        $newRoom = $this->gameFactory->createGame();
        return $this->roomRepository->addRoom($name, $newRoom);
    }
}