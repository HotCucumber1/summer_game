<?php

namespace App\Controller;

use App\Service\SessionService;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserController extends AbstractController
{
    public function __construct(private readonly UserService $userService)
    {
    }

    public function index(): Response
    {
        return $this->redirectToRoute('user/login');
    }

    public function signUp(): Response
    {
        return $this->render('login_form.html.twig');
    }

    public function login(Request $request): Response
    {
        $name = $request->get('name');
        $password = $request->get('password');
        try
        {
            $user = $this->userService->getUserByName($name);
            if (!$this->userService->isPasswordRight($user, $password))
            {
                return new Response('Password is incorrect', Response::HTTP_UNAUTHORIZED);
            }
            SessionService::putUserIdInSession($user->getUserId());

        }
        catch (NotFoundHttpException)
        {
            $userId = $this->userService->addUser($name, $password);
            SessionService::putUserIdInSession($userId);
        }
        return $this->redirectToRoute('game');
    }

    /*public function signIn(Request $request): Response
    {
        $name = $request->get('name');
        $password = $request->get('password');

        $user = $this->userService->getUserByName($name);
        if (!$this->userService->isPasswordRight($user, $password))
        {
            throw new BadRequestException("Password is incorrect");
        }
        SessionService::putUserIdInSession($user->getUserId());

        return $this->redirectToRoute('game');
    }*/
}