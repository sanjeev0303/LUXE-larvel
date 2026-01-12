<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index()
    {
        return Cache::remember('products.all', 300, function () {
            return Product::all();
        });
    }

    public function show($id)
    {
        return Cache::remember("products.{$id}", 300, function () use ($id) {
            return Product::findOrFail($id);
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'stock' => 'required|integer',
            'collection_id' => 'nullable|exists:collections,id',
            'sizes' => 'nullable|array', // Expecting array
            'sizes.*' => 'string',
        ]);

        if ($request->hasFile('image')) {
            $uploadedFileUrl = cloudinary()->uploadApi()->upload($request->file('image')->getRealPath())['secure_url'];
            $validated['image_url'] = $uploadedFileUrl;
            unset($validated['image']);
        }

        $product = Product::create($validated);
        Cache::forget('products.all');
        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $rules = [
            'name' => 'sometimes|string',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
            'collection_id' => 'nullable|exists:collections,id',
            'sizes' => 'nullable|array',
            'sizes.*' => 'string',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
        }

        $validated = $request->validate($rules);

        if ($request->hasFile('image')) {
            $uploadedFileUrl = cloudinary()->uploadApi()->upload($request->file('image')->getRealPath())['secure_url'];
            $validated['image_url'] = $uploadedFileUrl;
            unset($validated['image']);
        }

        $product->update($validated);

        Cache::forget('products.all');
        Cache::forget("products.{$id}");

        return response()->json($product, 200);
    }

    public function destroy($id)
    {
        Product::destroy($id);

        Cache::forget('products.all');
        Cache::forget("products.{$id}");

        return response()->json(null, 204);
    }
}
