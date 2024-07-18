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
    protected const INTERVAL = 0.03;
    /**
     * @var array<string, string>
     */
    private array $clientRooms = [];

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

        // ping
        if (isset($data['type']) && $data['type'] === 'ping')
        {
            $response = json_encode([
                'type' => 'pong',
                'timestamp' => $data['timestamp']
            ]);
            $from->send($response);
        }

        // for one room
        if (isset($data['userName']))
        {
            $this->gameInfo->addUserToGame($from->resourceId, $data['userName']);
        }

        // update user info
        if (isset($data['snake']))
        {
            $this->gameInfo->setGameStatus($msg, $from->resourceId);
//            $gameId = $this->clientRooms[$from->resourceId];
//            $currentRoom = $this->roomRepository->getRoomById($gameId);
//            $currentRoom->setGameStatus($msg, $from->resourceId);
        }

        // create room
        if (isset($data['newRoom']))
        {
            $currentRoom = $this->roomRepository->addRoom($data['newRoom']['roomId']);
            $currentRoom->addUserToGame($from->resourceId, $data['newRoom']['userName']);

            $this->clientRooms[$from->resourceId] = $data['roomId'];
        }

        //join room
        if (isset($data['joinRoom']))
        {
            $currentRoom = $this->roomRepository->getRoomById($data['joinRoom']['roomId']);
            $currentRoom->addUserToGame($from->resourceId, $data['joinRoom']['userName']);

            $this->clientRooms[$from->resourceId] = $data['roomId'];
        }
    }

    private function sendData(): void
    {
        $response = json_encode($this->gameInfo->getData(), JSON_THROW_ON_ERROR | true);
        foreach ($this->clients as $client)
        {
            // $gameId = $this->clientRooms[$client->resourceId];
            // $room = $this->roomRepository->getRoomById($gameId);
            // $response = json_encode($room->getData());
            $client->send($response);
        }
    }

    public function onClose(ConnectionInterface $conn): void
    {
        $this->clients->detach($conn);
        $this->gameInfo->deleteUser($conn->resourceId);

//        $gameId = $this->clientRooms[$conn->resourceId];
//        $room = $this->roomRepository->getRoomById($gameId);
//        $room->deleteUser($conn->resourceId);

        unset($this->clientRooms[$conn->resourceId]);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e): void
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}