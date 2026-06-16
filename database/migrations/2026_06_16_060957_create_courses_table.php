<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {

    $table->id();

    $table->foreignId('organization_id')

          ->constrained()

          ->onDelete('cascade');

    $table->string('course_name');

    $table->text('description')->nullable();

    $table->string('flyer')->nullable();

    $table->string('banner')->nullable();

    $table->decimal('course_fee', 10, 2)->nullable();

    $table->decimal('application_fee', 10, 2)->nullable();

    $table->text('requirements')->nullable();

    $table->string('more_details_link')->nullable();

    $table->timestamps();

});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
