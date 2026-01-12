<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        return Cache::remember("orders.user.{$userId}", 300, function () use ($request) {
            return $request->user()->orders()
                ->with('items.product')
                ->orderBy('created_at', 'desc')
                ->limit(50)
                ->get();
        });
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'total_amount' => 'required|numeric',
            'stripe_payment_id' => 'required|string',
            'address_id' => 'nullable|exists:addresses,id',
        ]);

        $order = Order::create([
            'user_id' => Auth::id(),
            'total_amount' => $request->total_amount,
            'status' => 'paid',
            'stripe_payment_id' => $request->stripe_payment_id,
            'address_id' => $request->address_id,
        ]);

        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        // Invalidate user's order cache and admin cache
        Cache::forget("orders.user." . Auth::id());
        Cache::forget('orders.admin.all');

        return response()->json($order->load('items'), 201);
    }

    public function adminIndex()
    {
        return Cache::remember('orders.admin.all', 120, function () {
            return Order::with(['user', 'items.product'])
                ->orderBy('created_at', 'desc')
                ->limit(100)
                ->get();
        });
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        // Invalidate caches for the order owner and admin
        Cache::forget("orders.user.{$order->user_id}");
        Cache::forget('orders.admin.all');

        return response()->json($order);
    }
}
