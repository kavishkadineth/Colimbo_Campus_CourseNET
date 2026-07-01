<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$u = \App\Models\User::firstOrCreate(
    ['email' => 'lecture@test.com'],
    ['name' => 'Lecture Admin', 'password' => bcrypt('password'), 'role' => 'lecture_admin']
);
$token = \Illuminate\Support\Str::random(80);
$u->api_token = hash('sha256', $token);
$u->save();
echo "TOKEN: $token\n";
