<?php

namespace App\Factory;

use App\Repository\PointRepository;
use App\Repository\SnakeRepository;
use App\Repository\UserRepository;
use App\Service\CollisionService;
use App\Service\GameInfo;
use App\Service\PasswordHasher;
use App\Service\PointService;
use App\Service\SnakeService;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;

class GameFactory
{
    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
    }

    public function createGame(): GameInfo
    {
        return new GameInfo(
            new CollisionService(
                new SnakeService(
                    new SnakeRepository()
                ),
            ),
            new PointService(
                new PointRepository(),
            ),
            new SnakeService(
                new SnakeRepository(),
            ),
            new UserService(
                new UserRepository(
                    $this->entityManager),
                new PasswordHasher()
            )
        );
    }
}