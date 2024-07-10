<?php

namespace App\Service\Server;

use App\Controller\GameController;
use App\Repository\RoomRepository;
use App\Service\GameInfo;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use React\EventLoop\LoopInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;


class WebSocketServer implements MessageComponentInterface
{
    protected \SplObjectStorage $clients;
    protected const INTERVAL = 0.02;
    private array $clientRooms;

    public function __construct(private readonly LoopInterface $loop,
                                private readonly GameInfo $gameInfo,
                                private readonly RoomRepository $roomRepository)
    {
        $this->clients = new \SplObjectStorage;
        $this->clientRooms = [];
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
        $data = json_decode($msg, false, 512, JSON_THROW_ON_ERROR);
        /*if (isset($data['roomId']))
        {
            $roomId = $data['roomId'];
            // Записать текущему клиенту код комнаты
            $this->clientRooms[$from->resourceId] = $roomId;

            $room = $this->roomRepository->getRoomByName($roomId);
            if ($room === null)
            {
                $this->roomRepository->addRoom($roomId);
                $room = $this->roomRepository->getRoomByName($roomId);
            }
            $room->setGameStatus($msg);
        }*/
        $this->gameInfo->setGameStatus($msg);
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
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e): void
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}