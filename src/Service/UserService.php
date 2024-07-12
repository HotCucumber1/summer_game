<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepositoryInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserService
{
    public function __construct(private readonly UserRepositoryInterface $userRepository,
                                private readonly PasswordHasher $hasher)
    {
    }

    public function addUser(string $name, string $password): int
    {
        if (!$this->isValid($name, $password))
        {
            throw new BadRequestException("User data is not valid");
        }
        /*$existingUser = $this->userRepository->findUserByName($name);
        if ($existingUser !== null)
        {
            throw new UnauthorizedHttpException('User with name "' . $name . '" has already been registered');
        }*/
        $hashPassword = $this->hasher->hash($password);
        $user = new User(
            null,
            $name,
            $hashPassword,
            0
        );
        return $this->userRepository->store($user);
    }

    public function getUserById(string $id): User
    {
        $user = $this->userRepository->findUserById($id);
        if ($user === null)
        {
            throw new BadRequestException("User not found");
        }
        return $user;
    }
    
    public function getUserByName(string $name): User
    {
        $user = $this->userRepository->findUserByName($name);
        if ($user === null)
        {
            throw new NotFoundHttpException("User not found");
        }
        return $user;
    }

    public function setUserScore(int $userId, int $score): void
    {
        $user = $this->userRepository->findUserById($userId);
        if ($score > $user->getScore())
        {
            $user->setScore($score);
            $this->userRepository->store($user);
        }
    }

    public function isPasswordRight(User $user, string $password): bool
    {
        $userPassword = $user->getPassword();
        return $this->hasher->hash($password) === $userPassword;
    }

    private function isValid(string $name, string $password): bool
    {
        return !(strlen($name) < 3 || strlen($password) < 6);
    }
}