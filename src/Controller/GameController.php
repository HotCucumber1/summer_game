<?php

namespace App\Controller;

use App\Service\GameInfo;
use App\Service\GameSettingsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class GameController extends AbstractController
{
    public function __construct(private readonly GameInfo $gameInfo,
                                private readonly GameSettingsService $settingsService)
    {
    }

    public function index(): Response
    {
        return new Response('hello');
    }

    public function start(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['width']))
        {
            throw new BadRequestException('Screen is not defined');
        }
        if (!isset($data['height']))
        {
            throw new BadRequestException('Screen is not defined');
        }
        $this->settingsService->setWindowSize($data['width'], $data['height']);

        return $this->redirectToRoute('test');
    }

    public function setSnakeDirection(Request $request): Response
    {
        $jsonData = $request->getContent();
        $data = json_decode($jsonData, true);
        if (!isset($data['up']) ||
            !isset($data['down']) ||
            !isset($data['left']) ||
            !isset($data['right']) ||
            !isset($dta['boost']))
        {
            throw new BadRequestException('Not enough information about direction');
        }
        $this->gameInfo->keyMovement($data);
        return new Response('OK', 200);
    }

    public function getGameInfo(): JsonResponse
    {
        return new JsonResponse($this->gameInfo->getData());
    }
}