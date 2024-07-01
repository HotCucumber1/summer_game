<?php

use App\Service\GameInfo;

// $userEventsJson = file_get_contents("php://input");
// $userEvents = json_decode($userEventsJson);
$game = new GameInfo();

$snake = $game->start();
$data = $game->getData($snake);

echo $data;

