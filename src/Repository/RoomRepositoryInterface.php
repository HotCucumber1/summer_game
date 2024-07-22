<?php

namespace App\Repository;

use App\Service\GameInfo;

interface RoomRepositoryInterface
{
    public function addRoom(string $name, GameInfo $room): GameInfo;

    public function getRoomById(string $name): ?GameInfo;

    public function removeRoom(string $name): void;
}