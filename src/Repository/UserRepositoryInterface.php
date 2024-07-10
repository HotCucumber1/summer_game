<?php

namespace App\Repository;
use App\Entity\User;

interface UserRepositoryInterface
{
    public function findUserById(int $id): ?User;
    public function findUserByName(string $name): ?User;
    public function store(User $user): int;
    public function delete(User $user): void;
}