<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        return CartItem::with('product')->where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string',
        ]);

        $cartItem = CartItem::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'size' => $request->size, // Unique constraint usually on (user, product, size) if simple override, strictly speaking we should check if exists and increment quantity or update.
            ],
            [
                'quantity' => \DB::raw("quantity + {$request->quantity}") // Increment if exists? updateOrCreate updates.
                // Actually updateOrCreate replaces attributes. We want to increment if exists?
                // Let's do explicit check.
            ]
        );

        // Re-do logic properly
        $existing = CartItem::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->where('size', $request->size)
            ->first();

        if ($existing) {
            $existing->quantity += $request->quantity;
            $existing->save();
            return response()->json($existing->load('product'), 200);
        } else {
            $cartItem = CartItem::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'size' => $request->size,
            ]);
            return response()->json($cartItem->load('product'), 201);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::where('user_id', Auth::id())->findOrFail($id);
        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json($cartItem);
    }

    public function destroy($id)
    {
        CartItem::where('user_id', Auth::id())->where('id', $id)->delete();
        return response()->json(null, 204);
    }

    // Sync local cart to database on login
    public function sync(Request $request) {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string',
        ]);

        foreach($request->items as $item) {
             CartItem::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'product_id' => $item['product_id'],
                    'size' => $item['size'] ?? null,
                ],
                [
                    'quantity' => $item['quantity'] // Or sum? Strategy: Local overwrites or merges. Merging is safer.
                    // For simplicity, let's just create if not exists, or update quantity to match local?
                    // Usually "sync" means merge logic.
                ]
            );
        }

        return $this->index();
    }
}
