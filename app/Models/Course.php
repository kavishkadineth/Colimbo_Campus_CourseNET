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
        'requirements',
        'more_details_link'
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}