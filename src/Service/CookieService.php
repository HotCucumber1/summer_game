<?php

namespace App\Service;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CookieService
{
    private const COOKIE_NAME = 'user_id';
    public static function putUserId(int $id): void
    {
        setcookie(self::COOKIE_NAME, $id, time() + 900);
    }

    public static function getUserId(): int
    {
        if (isset($_COOKIE[self::COOKIE_NAME]))
        {
            return (int) $_COOKIE[self::COOKIE_NAME];
        }
        throw new NotFoundHttpException('User not found');
    }

    public static function destroyCookie(): void
    {
        setcookie(self::COOKIE_NAME, '', time() - 3600);
    }
}