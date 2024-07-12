<?php

namespace App\Service\Server;

use App\Service\SessionService;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use React\EventLoop\Loop;
use React\Socket\SocketServer;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


class StartWebSocketServerCommand extends Command
{
    protected static $defaultName = 'app:start-websocket-server';

    public function __construct(private readonly WebSocketServer $webSocketServer)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->setDescription('Starts the WebSocket server');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // $uri = '10.10.29.61:8080';
        // $uri = '192.168.140.3';
        $uri = '10.250.104.40:8080';
        $loop = Loop::get();

        $ws = new WsServer($this->webSocketServer);
        $http = new HttpServer($ws);
        $socket = new SocketServer($uri, [], $loop);
        $server = new IoServer($http, $socket, $loop);


        $output->writeln('WebSocket server started on port 8080');
        $loop->run();

        return Command::SUCCESS;
    }
}