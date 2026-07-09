<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->text('address');
            $table->string('id_number');
            $table->string('al_index_number');
            $table->text('al_results');          // free text: subject + grade pairs
            $table->string('payment_sheet')->nullable(); // uploaded file path
            $table->string('status')->default('pending'); // pending, reviewing, accepted, rejected
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
