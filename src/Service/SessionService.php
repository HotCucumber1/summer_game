<?php

namespace App\Service;

use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class SessionService
{
    private const SESSION_NAME = 'user';

    public static function putUserIdInSession(int $id): bool
    {
        session_name(self::SESSION_NAME);
        session_start();
        $_SESSION['user_id'] = $id;
        if ($_SESSION['user_id'])
        {
            return true;
        }
        return false;
    }

    public static function takeUserIdFromSession(): int
    {
        session_name(self::SESSION_NAME);
        session_start();
        if (in_array('user_id', array_keys($_SESSION)))
        {
            return $_SESSION['user_id'];
        }
        throw new UnauthorizedHttpException('You are not authorized');
    }

    public static function destroySession(): void
    {
        session_name(self::SESSION_NAME);
        session_start();

        $_SESSION = [];
        session_destroy();
        setcookie(session_name(), "", time() - 3600);
    }
}