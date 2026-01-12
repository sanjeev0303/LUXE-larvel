<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index()
    {
        return Wishlist::with('product')->where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $wishlist = Wishlist::firstOrCreate([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id
        ]);

        return response()->json($wishlist->load('product'), 201);
    }

    public function destroy($id) // Accepts product_id or wishlist_id? Usually easier to pass product_id for toggle
    {
        // If frontend passes wishlist ID:
        // Wishlist::destroy($id);

        // But for toggling logic, we might pass product_id. Let's assume ID is wishlist ID for RESTful standard,
        // OR handle by product_id delete query.
        // Let's stick to standard destroy(id) where id is wishlist id.
        // Wait, frontend usually knows product_id. Let's make a route removing by product_id more convenient?
        // Actually, RESTful: DELETE /wishlists/{id}

        $deleted = Wishlist::where('id', $id)->where('user_id', Auth::id())->delete();

        // Alternative: Delete by product_id if passed
        // $deleted = Wishlist::where('product_id', $id)->where('user_id', Auth::id())->delete();

        return response()->json(null, 204);
    }

    // Custom endpoint to toggle/remove by product ID might be easier for frontend
    public function toggle(Request $request) {
        $request->validate(['product_id' => 'required|exists:products,id']);

        $wishlist = Wishlist::where('user_id', Auth::id())->where('product_id', $request->product_id)->first();

        if ($wishlist) {
            $wishlist->delete();
            return response()->json(['status' => 'removed'], 200);
        } else {
            $new = Wishlist::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id
            ]);
            return response()->json(['status' => 'added', 'data' => $new->load('product')], 201);
        }
    }
}
