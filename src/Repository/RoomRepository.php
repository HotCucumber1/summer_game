<?php

namespace App\Repository;

use App\Factory\GameFactory;
use App\Service\GameInfo;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class RoomRepository
{
    private array $rooms = [];

    public function __construct(private GameFactory $factory)
    {
    }

    public function addRoom(string $name): void
    {
        if (isset($this->rooms[$name]))
        {
            throw new BadRequestException('Room already exists');
        }
        $this->rooms[$name] = $this->factory->createGame();
    }

    public function getRoomByName(string $name): ?GameInfo
    {
        return $this->rooms[$name] ?? null;
    }

    public function removeRoom(string $name): void
    {
        unset($this->rooms[$name]);
    }
}