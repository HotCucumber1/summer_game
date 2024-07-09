<?php

namespace App\Controller;

use App\Service\GameInfo;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
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
    public function start(Request $request): Response
    {
        return $this->render('ws_testing.html.twig');
    }

    /*public function setSnakeDirection(Request $request): Response
    {
        $jsonData = $request->request->get('data');
        $data = json_decode($jsonData, true);

        if (!isset($data['snake']) ||
            !isset($data['snake']['id']) ||
            !isset($data['snake']['x']) ||
            !isset($data['snake']['y']) ||
            !isset($data['snake']['radius']) ||
            !isset($data['snake']['score']) ||
            !isset($data['snake']['body'])
        )
        {
            throw new BadRequestException('Not enough information about snake');
        }
        // $this->gameInfo->keyMovement($data);
        $this->gameInfo->checkCollision($data);
        return new Response('OK', 200);
    }*/

    public function getGameInfo(): JsonResponse
    {
        return new JsonResponse($this->gameInfo->getData());
    }
}