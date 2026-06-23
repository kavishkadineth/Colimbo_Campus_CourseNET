<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class AuthApiController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 422);
        }

        $token = $this->issueToken($user);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function demoLogin(Request $request)
    {
        $data = $request->validate([
            'email' => ['nullable', 'email'],
        ]);

        $email = $data['email'] ?? 'test@example.com';

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => 'Demo Admin',
                'password' => Hash::make(Str::random(32)),
                'role' => User::ROLE_SYSTEM_ADMIN,
            ]
        );

        if (! $user->isSystemAdmin()) {
            $user->forceFill([
                'role' => User::ROLE_SYSTEM_ADMIN,
            ])->save();
        }

        $token = $this->issueToken($user);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->forceFill([
            'api_token' => null,
        ])->save();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    public function adminUsers()
    {
        return response()->json(
            User::whereIn('role', [User::ROLE_SYSTEM_ADMIN, User::ROLE_LECTURE_ADMIN])
                ->select('id', 'name', 'email', 'role', 'created_at')
                ->orderBy('name')
                ->get()
        );
    }

    public function storeAdminUser(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in([User::ROLE_SYSTEM_ADMIN, User::ROLE_LECTURE_ADMIN])],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
        ]);

        return response()->json($user, 201);
    }

    public function updateAdminUser(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in([User::ROLE_SYSTEM_ADMIN, User::ROLE_LECTURE_ADMIN])],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
        ]);

        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }

        $user->save();

        return response()->json($user);
    }

    public function deleteAdminUser(Request $request, User $user)
    {
        if ($request->user()->is($user)) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'Admin user deleted successfully.',
        ]);
    }

    private function issueToken(User $user): string
    {
        $token = Str::random(80);

        $user->forceFill([
            'api_token' => hash('sha256', $token),
        ])->save();

        return $token;
    }
}
