<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class GameController extends AbstractController
{
    public function selectRoom(): Response
    {
        return $this->render('mp_rooms_game.html.twig');
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
        return $this->render('mp_game.html.twig');
    }

    public function single(): Response
    {
        return $this->render('sp_game.html.twig');
    }

    public function reset(): Response
    {
        return $this->redirectToRoute('game');
    }
}