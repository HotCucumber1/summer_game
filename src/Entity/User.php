<?php

namespace App\Entity;

/**
 * @ORM\Entity
 */
class User
{
    public function __construct(private ?int    $userId,
                                private string  $name, // unique
                                private ?string $password,
                                private int     $score)
    {
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function getScore(): int
    {
        return $this->score;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function setPassword(?string $password): void
    {
        $this->password = $password;
    }

    public function setScore(int $score): void
    {
        $this->score = $score;
    }
}