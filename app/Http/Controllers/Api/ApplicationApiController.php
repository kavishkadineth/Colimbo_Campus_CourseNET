<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationApiController extends Controller
{
    /**
     * Store a new application (Public API)
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'id_number' => 'required|string|max:50',
            'al_index_number' => 'required|string|max:50',
            'al_results' => 'required|string',
            'payment_sheet' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
        ]);

        if ($request->hasFile('payment_sheet')) {
            $path = $request->file('payment_sheet')->store('applications/payments', 'public');
            $data['payment_sheet'] = '/storage/' . $path;
        }

        $application = Application::create($data);

        return response()->json([
            'message' => 'Application submitted successfully',
            'application' => $application
        ], 201);
    }

    /**
     * Get all applications (System Admin API)
     */
    public function index(Request $request)
    {
        $query = Application::with('course:id,course_name,organization_id')
                    ->latest();

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    /**
     * Update application status (System Admin API)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,reviewing,accepted,rejected',
        ]);

        $application = Application::findOrFail($id);
        $application->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Application status updated successfully',
            'application' => $application
        ]);
    }

    /**
     * Delete an application (System Admin API)
     */
    public function destroy($id)
    {
        $application = Application::findOrFail($id);
        
        if ($application->payment_sheet) {
            $path = str_replace('/storage/', '', $application->payment_sheet);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
        }
        
        $application->delete();

        return response()->json(['message' => 'Application deleted successfully']);
    }
}
