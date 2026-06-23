<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->date('application_start_date')->nullable()->after('application_fee');
            $table->date('application_end_date')->nullable()->after('application_start_date');
            $table->date('program_start_date')->nullable()->after('application_end_date');
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn([
                'application_start_date',
                'application_end_date',
                'program_start_date',
            ]);
        });
    }
};
