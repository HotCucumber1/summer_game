<?php

namespace App\Service\Server;

use App\Repository\RoomRepository;
use App\Service\GameInfo;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use React\EventLoop\LoopInterface;


class WebSocketServer implements MessageComponentInterface
{
    protected \SplObjectStorage $clients;
    protected const INTERVAL = 0.02;
    private array $clientRooms = [];
    private bool $isLoaded = false;

    public function __construct(private readonly LoopInterface $loop,
                                private readonly GameInfo $gameInfo,
                                private readonly RoomRepository $roomRepository)
    {
        $this->clients = new \SplObjectStorage;
        $this->loop->addPeriodicTimer(self::INTERVAL, function() {
            $this->sendData();
        });
    }

    public function onOpen(ConnectionInterface $conn): void
    {
        $this->clients->attach($conn);
        echo "New connection {$conn->resourceId}\n";
    }

    public function onMessage(ConnectionInterface $from, $msg): void
    {
        $data = json_decode($msg, true);
        if (isset($data['type']) && $data['type'] === 'ping')
        {
            // Отправляем ответ с той же меткой времени
            $response = json_encode([
                'type' => 'pong',
                'timestamp' => $data['timestamp']
            ]);
            $from->send($response);
        }

        if (isset($data['name']))
        {
            $this->gameInfo->addUserToGame($from->resourceId, $data['name']);
        }

        if (isset($data['snake']))
        {
            $this->gameInfo->setGameStatus($msg, $from->resourceId);
        }
    }

    public function sendData(): void
    {
        $response = json_encode($this->gameInfo->getData(), JSON_THROW_ON_ERROR | true);
        foreach ($this->clients as $client)
        {
            $client->send($response);
        }
    }

    public function onClose(ConnectionInterface $conn): void
    {
        $this->clients->detach($conn);
        $this->gameInfo->deleteUser($conn->resourceId);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e): void
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}