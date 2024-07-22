<?php

namespace App\Server;

use App\Repository\RoomRepository;
use App\Service\RoomService;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use React\EventLoop\LoopInterface;


class WebSocketServer implements MessageComponentInterface
{
    protected \SplObjectStorage $clients;
    protected const INTERVAL = 0.03;
    /**
     * @var array<string, string>
     */
    private array $clientRooms = [];

    public function __construct(private readonly LoopInterface $loop,
                                private readonly RoomService $roomService,
                                private readonly RoomRepository $roomRepository)
    {
        $this->clients = new \SplObjectStorage;
        $this->loop->addPeriodicTimer(self::INTERVAL, function()
        {
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

        // ping
        if (isset($data['type']) && $data['type'] === 'ping')
        {
            $response = json_encode([
                'type' => 'pong',
                'timestamp' => $data['timestamp']
            ]);
            $from->send($response);
        }

        if (isset($data['points']))
        {
            $gameId = $this->clientRooms[$from->resourceId];
            $currentRoom = $this->roomRepository->getRoomById($gameId);
            $currentRoom->isStart = false;
        }

        // update user info
        if (isset($data['snake']))
        {
            $gameId = $this->clientRooms[$from->resourceId];
            $currentRoom = $this->roomRepository->getRoomById($gameId);

            // Добавить парсинг данных и сущность Input

            $currentRoom->setGameStatus($msg, $from->resourceId);
        }

        // create room
        if (isset($data['newRoom']))
        {
            $newRoom = $this->roomService->createRoom();
            $currentRoom = $this->roomRepository->addRoom($data['newRoom']['roomId'], $newRoom);
            $currentRoom->addUserToGame($from->resourceId, $data['newRoom']['userName']);

            $this->clientRooms[$from->resourceId] = $data['newRoom']['roomId'];
        }

        //join room
        if (isset($data['joinRoom']))
        {
            $currentRoom = $this->roomRepository->getRoomById($data['joinRoom']['roomId']);
            if ($currentRoom !== null)
            {
                $currentRoom->addUserToGame($from->resourceId, $data['joinRoom']['userName']);
                $this->clientRooms[$from->resourceId] = $data['joinRoom']['roomId'];
            }
        }
    }

    private function sendData(): void
    {
        foreach ($this->clients as $client)
        {
            if (isset($this->clientRooms[$client->resourceId]))
            {
                $gameId = $this->clientRooms[$client->resourceId];
                $room = $this->roomRepository->getRoomById($gameId);
                $response = json_encode($room->getData());
                $client->send($response);
            }
        }
    }

    public function onClose(ConnectionInterface $conn): void
    {
        $this->clients->detach($conn);

        $gameId = $this->clientRooms[$conn->resourceId];
        $room = $this->roomRepository->getRoomById($gameId);
        $room->deleteUser($conn->resourceId);

        unset($this->clientRooms[$conn->resourceId]);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e): void
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}