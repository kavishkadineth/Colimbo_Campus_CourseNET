<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\Request;

class OrganizationApiController extends Controller
{
    public function index()
    {
        return response()->json(
            Organization::with('courses')->get()
        );
    }

    public function store(Request $request)
    {
        $organization = Organization::create([
            'name' => $request->name,
            'type' => $request->type,
            'department' => $request->department,
        ]);

        return response()->json($organization, 201);
    }

    public function update(Request $request, $id)
    {
        $organization = Organization::findOrFail($id);

        $organization->update([
            'name' => $request->name,
            'type' => $request->type,
            'department' => $request->department,
        ]);

        return response()->json($organization);
    }

    public function destroy($id)
    {
        $organization = Organization::findOrFail($id);

        $organization->delete();

        return response()->json([
            'message' => 'Organization deleted successfully'
        ]);
    }
}