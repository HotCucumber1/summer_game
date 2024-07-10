<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;

class UserRepository implements UserRepositoryInterface
{
    private EntityRepository $repository;
    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
        $this->repository = $entityManager->getRepository(User::class);
    }

    /**
     * @throws OptimisticLockException
     * @throws ORMException
     */
    public function findUserById(int $id): ?User
    {
        return $this->entityManager->find(User::class, $id);
    }

    public function findUserByName(string $name): ?User
    {
        return $this->repository->findOneBy(['name' => $name]);
    }

    public function store(User $user): int
    {
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        return $user->getUserId();
    }

    public function delete(User $user): void
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }
}