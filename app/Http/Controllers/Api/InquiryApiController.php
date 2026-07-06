<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryApiController extends Controller
{
    // Public: anyone can submit an inquiry
    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $inquiry = Inquiry::create([
            'name'    => $request->name,
            'email'   => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            'status'  => 'new',
        ]);

        return response()->json([
            'message' => 'Your inquiry has been submitted successfully.',
            'inquiry' => $inquiry,
        ], 201);
    }

    // System admin: get all inquiries
    public function index()
    {
        return response()->json(
            Inquiry::orderBy('created_at', 'desc')->get()
        );
    }

    // System admin: get one inquiry + mark as read
    public function show($id)
    {
        $inquiry = Inquiry::findOrFail($id);

        if ($inquiry->status === 'new') {
            $inquiry->update(['status' => 'read']);
        }

        return response()->json($inquiry);
    }

    // System admin: delete an inquiry
    public function destroy($id)
    {
        $inquiry = Inquiry::findOrFail($id);
        $inquiry->delete();

        return response()->json(['message' => 'Inquiry deleted successfully.']);
    }

    // System admin: count of new (unread) inquiries
    public function unreadCount()
    {
        return response()->json([
            'count' => Inquiry::where('status', 'new')->count(),
        ]);
    }
}
