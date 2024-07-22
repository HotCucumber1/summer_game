<?php

namespace App\Server;

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
    // private string $host = '10.10.24.132';

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
        $loop = Loop::get();
        $uri = $_ENV['HOST'] . ':' . $_ENV['PORT'];

        $ws = new WsServer($this->webSocketServer);
        $http = new HttpServer($ws);
        $socket = new SocketServer($uri, [], $loop);
        $server = new IoServer($http, $socket, $loop);


        $output->writeln("WebSocket server started on port {$_ENV['PORT']}");
        $loop->run();

        return Command::SUCCESS;
    }
}