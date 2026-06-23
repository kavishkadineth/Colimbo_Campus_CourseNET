<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->date('program_end_date')->nullable()->after('program_start_date');
            $table->string('status')->nullable()->after('program_end_date');
            $table->string('intake')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn([
                'program_end_date',
                'status',
                'intake',
            ]);
        });
    }
};
