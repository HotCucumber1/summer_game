<?php

$userEventsJson = file_get_contents("php://input");
$userEvents = json_decode($userEventsJson);

