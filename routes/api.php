<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OrganizationApiController;
use App\Http\Controllers\Api\CourseApiController;

/*
|--------------------------------------------------------------------------
| Organization API Routes
|--------------------------------------------------------------------------
*/

Route::get('/organizations', [OrganizationApiController::class, 'index']);
Route::post('/organizations', [OrganizationApiController::class, 'store']);
Route::put('/organizations/{id}', [OrganizationApiController::class, 'update']);
Route::delete('/organizations/{id}', [OrganizationApiController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Course API Routes
|--------------------------------------------------------------------------
*/

Route::get('/courses', [CourseApiController::class, 'index']);
Route::post('/courses', [CourseApiController::class, 'store']);
Route::put('/courses/{id}', [CourseApiController::class, 'update']);
Route::delete('/courses/{id}', [CourseApiController::class, 'destroy']);