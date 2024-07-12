<?php

namespace App\Entity;

class Color
{
    private const COLORS = [
        "#1abc9c", "#2ecc71", "#3498db", "#9b59b6",
        "#16a085", "#27ae60", "#2980b9", "#8e44ad",
        "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1",
        "#f39c12", "#d35400", "#c0392b", "#bdc3c7"
    ];

    public static function getRandomColor(): string
    {
        $key = array_rand(self::COLORS);
        return Color::COLORS[$key];
    }
}