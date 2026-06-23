<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\OrganizationApiController;
use App\Http\Controllers\Api\CourseApiController;
use App\Models\User;

Route::post('/login', [AuthApiController::class, 'login']);
Route::post('/demo-login', [AuthApiController::class, 'demoLogin']);
Route::get('/courses', [CourseApiController::class, 'index']);
Route::get('/courses/{id}', [CourseApiController::class, 'show']);

Route::middleware('api.token')->group(function () {
    Route::get('/me', [AuthApiController::class, 'me']);
    Route::post('/logout', [AuthApiController::class, 'logout']);

    Route::middleware('role:'.User::ROLE_SYSTEM_ADMIN)->group(function () {
        Route::get('/admin-users', [AuthApiController::class, 'adminUsers']);
        Route::post('/admin-users', [AuthApiController::class, 'storeAdminUser']);
        Route::put('/admin-users/{user}', [AuthApiController::class, 'updateAdminUser']);
        Route::delete('/admin-users/{user}', [AuthApiController::class, 'deleteAdminUser']);
    });

    Route::middleware('role:'.User::ROLE_LECTURE_ADMIN)->group(function () {
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

        Route::post('/courses', [CourseApiController::class, 'store']);
        Route::put('/courses/{id}', [CourseApiController::class, 'update']);
        Route::delete('/courses/{id}', [CourseApiController::class, 'destroy']);
    });
});
