<?php

namespace App\Service\Server;

use App\Controller\GameController;
use App\Service\GameInfo;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use React\EventLoop\LoopInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;


class WebSocketServer implements MessageComponentInterface
{
    protected \SplObjectStorage $clients;
    protected string $gameState;
    protected const INTERVAL = 0.02;

    public function __construct(private readonly LoopInterface $loop,
                                private GameInfo $gameInfo)
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

    public function onMessage(ConnectionInterface $from,  $msg): void
    {
        $this->gameInfo->setGameStatus($msg);
    }

    public function sendData(): void
    {
        $response = json_encode($this->gameInfo->getData());
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