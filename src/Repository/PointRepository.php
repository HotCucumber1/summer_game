<?php

namespace App\Repository;

use App\Entity\Point;
use Ds\Set;

class PointRepository
{
    const COLORS = array(
        "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#16a085", "#27ae60", "#2980b9", "#8e44ad",
        "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#f39c12", "#d35400", "#c0392b", "#bdc3c7"
    );

    public static array $points = [];

    public function __construct()
    {
    }

    public function addPoint(): void
    {
        // TODO: получить рамеры окна
        $x = rand(1, 1000);       // maxCanvasWidth - когда определим размер поля и форму
        $y = rand(1, 1000);      // maxCanvasWidth - когда определим размер поля и форму
        $color = $this->getPointColor();
        $point = new Point($x, $y, $color);

        self::$points[] = $point;
    }

    public function findPoints(): ?array
    {
        // TODO: вернуть все точки
    }

    public function getPointColor(): string
    {
        $key = array_rand(self::COLORS);
        return self::COLORS[$key];
    }
}