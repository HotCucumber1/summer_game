<?php

namespace App\Controller;

use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
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
        }
        catch (NotFoundHttpException)
        {
            try
            {
                $userId = $this->userService->addUser($name, $password);
            }
            catch (BadRequestException $exception)
            {
                return new Response("{$exception->getMessage()}", Response::HTTP_BAD_REQUEST);
            }

        }
        return $this->redirectToRoute('menu');
    }

    public function getScore(Request $request, $name): JsonResponse
    {
        $user = $this->userService->getUserByName($name);
        $response = [
            'wins' => $user->getScore()
        ];
        return new JsonResponse($response);
    }
}