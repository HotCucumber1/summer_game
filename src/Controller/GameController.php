<?php

namespace App\Controller;


use App\Service\GameInfo;
use App\Entity\Snake;

class GameController
{
    private Snake $snake;

    public function __construct(private readonly GameInfo $gameInfo)
    {
        $this->snake = $this->gameInfo->start();
    }

    public function getGameInfo(): void
    {
        $jsonData = $this->gameInfo->getData($this->snake);
    }
}