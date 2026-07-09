<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'course_id',
        'full_name',
        'email',
        'phone',
        'address',
        'id_number',
        'al_index_number',
        'al_results',
        'payment_sheet',
        'status',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
