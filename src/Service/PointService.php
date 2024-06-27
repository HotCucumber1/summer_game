<?php

namespace App\Service;

use App\Entity\Point;


class PointService
{
    const COLORS = array(
        "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#16a085", "#27ae60", "#2980b9", "#8e44ad",
        "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#f39c12", "#d35400", "#c0392b", "#bdc3c7"
    );

    public function __construct()
    {
    }

    public function addPoint(): void
    {
        // TODO: заменить размеры, первоначально получить их при запуске приложения
        $x = rand(1, maxCanvasWidth);       // maxCanvasWidth - когда определим размер поля и форму
        $y = rand(1, maxCanvasHeight);      // maxCanvasWidth - когда определим размер поля и форму
        $color = $this->getPointColor();
        $point = new Point($x, $y, $color);
        // TODO: добавить точку к массиву точек в PointRepo->добавить точку
    }

    public function clearPoint(Point $point)
    {
        // TODO: обращаемся к массиву с Точками в PointRepo -> удаляем точку
    }

    public function getPointColor(): string
    {
        $key = array_rand(self::COLORS);
        return self::COLORS[$key];
    }
}
