<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    protected $fillable = [
        'name',
        'type',
        'department'
    ];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }
}