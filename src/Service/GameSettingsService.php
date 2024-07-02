<?php

namespace App\Service;
use Config\Config;

class GameSettingsService
{
    public function setWindowSize(int $width, int $height): void
    {
        Config::$windowHeight = $height;
        Config::$windowWidth = $width;
    }
}