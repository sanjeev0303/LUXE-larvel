<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'avatar' => 'nullable|image|max:2048', // 2MB Max
        ]);

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists (optional, depending on storage strategy)
            /*
            if ($user->avatar) {
                 // Storage::disk('cloudinary')->delete($user->avatar); // logic depends on stored path
            }
            */

            try {
                $path = $request->file('avatar')->storeOnCloudinary('avatars')->getSecurePath();
                $user->avatar = $path;
            } catch (\Exception $e) {
                // Fallback to local if cloudinary fails or not configured properly
                $path = $request->file('avatar')->store('avatars', 'public');
                $user->avatar = '/storage/' . $path;
            }
        }

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
