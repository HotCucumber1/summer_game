<?php

namespace App\Service;

use App\Entity\Snake;
use App\Entity\Point;
use App\Entity\Wall;

class CollisionService implements CollisionServiceInterface
{
    public function __construct(private readonly SnakeService $snakeService)
    {
    }

    public function isSnakeBump(Snake $snake): bool
    {
        $snakeX = $snake->getHeadX();
        $snakeY = $snake->getHeadY();
        $snakeRadius = $snake->getRadius();

        $currentId = $snake->getId();

        $snakes = $this->snakeService->getSnakes();
        foreach ($snakes as $id => $snake)
        {
            if ($id !== $currentId)
            {
                foreach ($snake->getBodyParts() as $bodyPart)
                {
                    $bodyX = $bodyPart->getX();
                    $bodyY = $bodyPart->getY();
                    $sqrDistance = ($snakeX - $bodyX) ** 2 + ($snakeY - $bodyY) ** 2;
                    if ($sqrDistance <= ($snakeRadius + $bodyPart->getRadius()) ** 2)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public function isWallBump(Snake $snake): bool
    {
        $snakeX = $snake->getHeadX();
        $snakeY = $snake->getHeadY();
        $snakeR = $snake->getRadius();

        // TODO: division by zero
        if ($snakeX !== 0 && $snakeY !== 0)
        {
            $dist = sqrt(($snakeX - Wall::centreX) ** 2 + ($snakeY - Wall::centreY) ** 2);
            $sin = $snakeY / $dist;
            $cos = $snakeX / $dist;

            $bumpX = abs($snakeX) + $snakeR * abs($cos);
            $bumpY = abs($snakeY) + $snakeR * abs($sin);

            return ($bumpX ** 2 + $bumpY ** 2 >= Wall::$radius ** 2);
        }
        return false;
    }    
    
    public function isPointEaten(Snake $snake, Point $point): bool
    {
        $headX = $snake->getHeadX();
        $headY = $snake->getHeadY();
        $radius = $snake->getRadius();

        $pointX = $point->getX();
        $pointY = $point->getY();

        return (($pointX - $headX) ** 2 + ($pointY - $headY) ** 2 <= ($radius + 5) ** 2);
    }
}
