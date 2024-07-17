<?php

namespace App\Service;

use App\Entity\Snake;
use App\Entity\Point;
use App\Entity\Wall;

class CollisionService
{
    public function isSnakeBump(Snake $snake, array $players): bool
    {
        $snakeX = $snake->getHeadX();
        $snakeY = $snake->getHeadY();
        $snakeRadius = $snake->getRadius();

        $currentId = $snake->getId();

        // TODO: need to optimize maybe
        $snakes = $players;
        foreach ($snakes as $id => $snakeUser)
        {
            if ($id !== $currentId)
            {
                foreach ($snakeUser->getBodyParts() as $bodyPart)
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

    public function isWallBump(Snake $snake, int $wallRadius): bool
    {
        $snakeX = $snake->getHeadX();
        $snakeY = $snake->getHeadY();
        $snakeR = $snake->getRadius();

        if ($snakeX ** 2 + $snakeY ** 2 >= ($wallRadius - $snakeR - 10) ** 2)
        {
            $dist = sqrt(($snakeX - Wall::centreX) ** 2 + ($snakeY - Wall::centreY) ** 2);
            $sin = $snakeY / $dist;
            $cos = $snakeX / $dist;

            $bumpX = abs($snakeX) + $snakeR * abs($cos);
            $bumpY = abs($snakeY) + $snakeR * abs($sin);

            return ($bumpX ** 2 + $bumpY ** 2 >= $wallRadius ** 2);
        }
        return false;
    }    
    
    public function isPointEaten(Snake $snake, Point $point): bool
    {
        return (($point->getX() - $snake->getHeadX()) ** 2 +
                ($point->getY() - $snake->getHeadY()) ** 2 <= ($snake->getRadius() + 5) ** 2);
    }
}
