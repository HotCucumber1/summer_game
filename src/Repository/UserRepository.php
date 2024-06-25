<?php

namespace App\Repository;

use App\Entity\User;

class UserRepository implements UserRepositoryInterface
{
    public function __construct()
    {
    }

    public function findUserByName(string $name): User
    {
    }

    public function store(User $user): int
    {
    }
}