<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'collection_id')) {
                $table->foreignId('collection_id')->nullable()->constrained('collections')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'collection_id')) {
                $table->dropForeign(['collection_id']);
                $table->dropColumn('collection_id');
            }
        });
    }
};
