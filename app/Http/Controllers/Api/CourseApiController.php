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

    public function store(Request $request)
    {
        $course = Course::create([
            'organization_id' => $request->organization_id,
            'course_name' => $request->course_name,
            'description' => $request->description,
            'course_fee' => $request->course_fee,
            'application_fee' => $request->application_fee,
            'requirements' => $request->requirements,
            'more_details_link' => $request->more_details_link,
        ]);

        return response()->json($course, 201);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $course->update([
            'organization_id' => $request->organization_id,
            'course_name' => $request->course_name,
            'description' => $request->description,
            'course_fee' => $request->course_fee,
            'application_fee' => $request->application_fee,
            'requirements' => $request->requirements,
            'more_details_link' => $request->more_details_link,
        ]);

        return response()->json($course);
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