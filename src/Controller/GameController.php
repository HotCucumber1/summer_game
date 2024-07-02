<?php

namespace App\Controller;

use App\Service\GameInfo;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class GameController extends AbstractController
{
    public function __construct(private readonly GameInfo $gameInfo)
    {
    }

    public function index(): Response
    {
        return new Response('hello');
    }

    public function setGameSettings(): void
    {
    }

    public function getGameInfo(): JsonResponse
    {
        return new JsonResponse($this->gameInfo->getData());
    }
}