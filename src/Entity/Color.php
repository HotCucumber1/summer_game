<?php

namespace App\Entity;

class Color
{
    private const COLORS = [
        "#1efcdc", "#35ff86", "#4fb8ff", "#d768ff",
        "#1affb3", "#35ff85", "#49c8ff", "#bf60ff",
        "#ffde26", "#ff9e40", "#ff5d52", "#ffffff",
        "#ffad26", "#ff5e26", "#ff493f",
    ];

    public static function getRandomColor(): string
    {
        $key = array_rand(self::COLORS);
        return Color::COLORS[$key];
    }
}