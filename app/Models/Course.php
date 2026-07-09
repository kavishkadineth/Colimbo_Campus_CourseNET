<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'organization_id',
        'course_name',
        'description',
        'flyer',
        'banner',
        'course_fee',
        'application_fee',
        'application_start_date',
        'application_end_date',
        'program_start_date',
        'program_end_date',
        'status',
        'intake',
        'requirements',
        'more_details_link'
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
