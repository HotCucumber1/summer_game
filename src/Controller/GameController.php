<?php

namespace App\Controller;

use App\Service\GameInfo;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class GameController extends AbstractController
{
    public function __construct(private readonly GameInfo $gameInfo)
    {
    }

    public function index(): Response
    {
        return new Response('hello');
    }


    public function setSnakeDirection(Request $request): Response
    {
        $jsonData = $request->getContent();
        $data = json_decode($jsonData);
        var_dump($data);
        return new Response('OK', 200);
    }

    #[OA\Get(
        path: '/',
        responses: [
            new OA\Response(200, 'OK')
        ]
    )]
    public function getGameInfo(): JsonResponse
    {
        return new JsonResponse($this->gameInfo->getData());
    }
}