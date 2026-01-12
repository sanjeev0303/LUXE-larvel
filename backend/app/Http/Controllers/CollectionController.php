<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Collection::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:collections,slug',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $uploadedFileUrl = cloudinary()->uploadApi()->upload($request->file('image')->getRealPath())['secure_url'];
            $validated['image_url'] = $uploadedFileUrl;
            unset($validated['image']);
        }

        return Collection::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Collection::with('products')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);

        $rules = [
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:collections,slug,' . $id,
            'description' => 'nullable|string',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
        }

        $validated = $request->validate($rules);

        if ($request->hasFile('image')) {
            $uploadedFileUrl = cloudinary()->uploadApi()->upload($request->file('image')->getRealPath())['secure_url'];
            $validated['image_url'] = $uploadedFileUrl;
            unset($validated['image']);
        }

        $collection->update($validated);

        return $collection;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        return Collection::destroy($id);
    }
}
