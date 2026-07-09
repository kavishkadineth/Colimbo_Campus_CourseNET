<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\OrganizationApiController;
use App\Http\Controllers\Api\CourseApiController;
use App\Http\Controllers\Api\InquiryApiController;
use App\Models\User;

Route::post('/login', [AuthApiController::class, 'login']);
Route::post('/demo-login', [AuthApiController::class, 'demoLogin']);
Route::get('/courses', [CourseApiController::class, 'index']);
Route::get('/courses/{id}', [CourseApiController::class, 'show']);
Route::get('/organizations', [OrganizationApiController::class, 'index']);

// Public: submit an inquiry (no auth required)
Route::post('/inquiries', [InquiryApiController::class, 'store']);

Route::middleware('api.token')->group(function () {
    Route::get('/me', [AuthApiController::class, 'me']);
    Route::post('/logout', [AuthApiController::class, 'logout']);

    Route::middleware('role:'.User::ROLE_SYSTEM_ADMIN)->group(function () {
        Route::get('/admin-users', [AuthApiController::class, 'adminUsers']);
        Route::post('/admin-users', [AuthApiController::class, 'storeAdminUser']);
        Route::put('/admin-users/{user}', [AuthApiController::class, 'updateAdminUser']);
        Route::delete('/admin-users/{user}', [AuthApiController::class, 'deleteAdminUser']);

        // Inquiries — system admin only
        Route::get('/inquiries', [InquiryApiController::class, 'index']);
        Route::get('/inquiries/unread-count', [InquiryApiController::class, 'unreadCount']);
        Route::get('/inquiries/{id}', [InquiryApiController::class, 'show']);
        Route::delete('/inquiries/{id}', [InquiryApiController::class, 'destroy']);
    });

    Route::middleware('role:'.User::ROLE_SYSTEM_ADMIN.','.User::ROLE_LECTURE_ADMIN)->group(function () {
        /*
        |--------------------------------------------------------------------------
        | Organization API Routes
        |--------------------------------------------------------------------------
        */

        Route::post('/organizations', [OrganizationApiController::class, 'store']);
        Route::put('/organizations/{id}', [OrganizationApiController::class, 'update']);
        Route::delete('/organizations/{id}', [OrganizationApiController::class, 'destroy']);

        /*
        |--------------------------------------------------------------------------
        | Course API Routes
        |--------------------------------------------------------------------------
        */

        Route::post('/courses', [CourseApiController::class, 'store']);
        Route::post('/courses/{id}', [CourseApiController::class, 'update']);
        Route::put('/courses/{id}', [CourseApiController::class, 'update']);
        Route::delete('/courses/{id}', [CourseApiController::class, 'destroy']);
    });
});
