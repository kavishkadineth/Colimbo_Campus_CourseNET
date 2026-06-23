<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseApiController extends Controller
{
    public function index()
    {
        return response()->json(
            Course::with('organization')->get()
        );
    }

    public function show($id)
    {
        return response()->json(
            Course::with('organization')->findOrFail($id)
        );
    }

    public function store(Request $request)
    {
        $course = Course::create($this->courseData($request));

        return response()->json($course, 201);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $course->update($this->courseData($request));

        return response()->json($course);
    }

    private function courseData(Request $request): array
    {
        return [
            'organization_id' => $request->organization_id,
            'course_name' => $request->course_name,
            'description' => $request->filled('description') ? $request->description : null,
            'course_fee' => $request->filled('course_fee') ? $request->course_fee : null,
            'application_fee' => $request->filled('application_fee') ? $request->application_fee : null,
            'application_start_date' => $request->filled('application_start_date') ? $request->application_start_date : null,
            'application_end_date' => $request->filled('application_end_date') ? $request->application_end_date : null,
            'program_start_date' => $request->filled('program_start_date') ? $request->program_start_date : null,
            'program_end_date' => $request->filled('program_end_date') ? $request->program_end_date : null,
            'status' => $request->filled('status') ? $request->status : null,
            'intake' => $request->filled('intake') ? $request->intake : null,
            'requirements' => $request->filled('requirements') ? $request->requirements : null,
            'more_details_link' => $request->filled('more_details_link') ? $request->more_details_link : null,
        ];
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);

        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }
}
