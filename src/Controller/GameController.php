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

    public function showMenu(): Response
    {
        return $this->render('menu.html.twig');
    }

    public function start(Request $request): Response
    {
        return $this->render('game.html.twig');
    }

    public function reset(Request $request): Response
    {
        return $this->redirectToRoute('game');
    }
}