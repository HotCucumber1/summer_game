<?php

namespace App\Repository;

use App\Service\GameInfo;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class RoomRepository implements RoomRepositoryInterface
{
    /**
     * @var array<string, GameInfo>
     */
    private array $rooms = [];

    public function addRoom(string $name, GameInfo $room): GameInfo
    {
        if (isset($this->rooms[$name]))
        {
            throw new BadRequestException('Room already exists');
        }
        $this->rooms[$name] = $room;
        return $this->rooms[$name];
    }

    public function getRoomById(string $name): ?GameInfo
    {
        return $this->rooms[$name] ?? null;
    }

    public function removeRoom(string $name): void
    {
        unset($this->rooms[$name]);
    }
}