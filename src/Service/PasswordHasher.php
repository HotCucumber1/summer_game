<?php

namespace App\Service;

class PasswordHasher
{
    const SALT = 'sugar';

    public function hash(string $password): string
    {
        $hash1 = md5($password);
        return md5($hash1 . self::SALT);
    }
}