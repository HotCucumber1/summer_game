<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class GameController extends AbstractController
{
    public function index(): Response
    {
        return new Response('hello');
    }

    public function selectRoom(): Response
    {
        return $this->render('select_room.html.twig');
    }

    public function lobby(): Response
    {
        return $this->render('lobby.html.twig');
    }

    public function showMenu(): Response
    {
        return $this->render('menu.html.twig');
    }

    public function start(): Response
    {
        return $this->render('game.html.twig');
    }

    public function reset(): Response
    {
        return $this->redirectToRoute('game');
    }
}