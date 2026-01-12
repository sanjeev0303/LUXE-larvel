<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'image_url',
        'stock',
        'collection_id',
        'sizes',
        'images',
    ];

    protected $casts = [
        'sizes' => 'array',
        'images' => 'array',
    ];

    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }
}
