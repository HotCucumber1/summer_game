<?php

namespace App\Server;

use App\Repository\RoomRepositoryInterface;
use App\Service\GameInfo;
use App\Service\RoomService;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use React\EventLoop\LoopInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;


class WebSocketServer implements MessageComponentInterface
{
    protected \SplObjectStorage $clients;
    protected const INTERVAL = 0.03;
    /**
     * @var array<string, string>
     */
    private array $clientRoomsId = [];

    public function __construct(private readonly LoopInterface $loop,
                                private readonly RoomService $roomService,
                                private readonly RoomRepositoryInterface $roomRepository)
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
        if (!isset($data['type']))
        {
            throw new BadRequestException('Not enough data');
        }
        switch ($data['type'])
        {
            case 'ping':
                $this->handlePing($from, $data);
                break;
            case 'points':
                $this->handlePoints($from);
                break;
            case 'updateSnake':
                $this->handleSnakeUpdate($from, $data);
                break;
            case 'createRoom':
                $this->handleNewRoom($from, $data);
                break;
            case 'joinRoom':
                $this->handleJoinRoom($from, $data);
                break;
            case 'checkRoom':
                $this->handleCheckRoom($from, $data);
                break;
            case 'start';
                $this->handleStart($from);
                break;
            case 'startCheckCollision':
                $this->handleCheckCollision($from);
                break;
        }
    }

    public function onClose(ConnectionInterface $conn): void
    {
        $this->clients->detach($conn);
        $room = $this->getUserRoom($conn->resourceId);
        $room->deleteUser($conn->resourceId);

        unset($this->clientRoomsId[$conn->resourceId]);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e): void
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    private function sendData(): void
    {
        foreach ($this->clients as $client)
        {
            if (isset($this->clientRoomsId[$client->resourceId]))
            {
                $room = $this->getUserRoom($client->resourceId);
                $response = json_encode($room->getData());
                $client->send($response);
            }
        }
    }

    private function getUserRoom(string $userId): GameInfo
    {
        $gameId = $this->clientRoomsId[$userId];
        return $this->roomRepository->getRoomById($gameId);
    }

    private function handlePing(ConnectionInterface $from, array $data): void
    {
        $response = json_encode([
            'type' => 'pong',
            'timestamp' => $data['timestamp'],
        ]);
        $from->send($response);
    }

    private function handlePoints(ConnectionInterface $from): void
    {
        $currentRoom = $this->getUserRoom($from->resourceId);
        $currentRoom->isStart = false;
    }

    private function handleSnakeUpdate(ConnectionInterface $from, array $data): void
    {
        $currentRoom = $this->getUserRoom($from->resourceId);

        if (!isset($data['snake']['x']) ||
            !isset($data['snake']['y']) ||
            !isset($data['snake']['radius']) ||
            !isset($data['snake']['score']) ||
            !isset($data['snake']['body']) ||
            !isset($data['snake']['boost']) ||
            !isset($data['snake']['angle']))
        {
            throw new BadRequestException("Not enough information about snake");
        }
        $currentRoom->setGameStatus($data, $from->resourceId);
    }

    private function handleNewRoom(ConnectionInterface $from, array $data): void
    {
        try
        {
            $currentRoom = $this->roomService->addRoom($data['newRoom']['roomId']);
            $currentRoom->addUserToGame($from->resourceId, $data['newRoom']['userName']);

            $this->clientRoomsId[$from->resourceId] = $data['newRoom']['roomId'];
        }
        catch (BadRequestException $exception)
        {
            $errorMessage = [
                'roomExist' => $exception->getMessage(),
            ];
            $from->send(json_encode($errorMessage));
        }
    }

    private function handleJoinRoom(ConnectionInterface $from, array $data): void
    {
        $currentRoom = $this->roomRepository->getRoomById($data['joinRoom']['roomId']);
        if ($currentRoom !== null)
        {
            $currentRoom->addUserToGame($from->resourceId, $data['joinRoom']['userName']);
            $this->clientRoomsId[$from->resourceId] = $data['joinRoom']['roomId'];
        }
    }

    private function handleCheckRoom(ConnectionInterface $from, array $data): void
    {
        $room = $this->roomRepository->getRoomById($data['roomId']);
        if ($room !== null)
        {
            if ($room->inGame)
            {
                $message = ['isStarted' => true];
            }
            else
            {
                $message = ['roomExist' => true];
            }
        }
        else
        {
            $message = ['roomOk' => true];
        }
        $from->send(json_encode($message));
    }

    private function handleStart(ConnectionInterface $from): void
    {
        $roomId = $this->clientRoomsId[$from->resourceId];
        $room = $this->roomRepository->getRoomById($roomId);
        $room->isStart = true;
        $room->inGame = true;
        foreach ($this->clients as $client)
        {
            if ($this->clientRoomsId[$client->resourceId] === $roomId)
            {
                $client->send(json_encode(['start' => true]));
            }
        }
    }

    private function handleCheckCollision(ConnectionInterface $from): void
    {
        $room = $this->getUserRoom($from->resourceId);
        $room->checkSnakeCollision = true;
    }
}