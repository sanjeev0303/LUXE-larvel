import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronRight, X, Clock, CheckCircle, Truck, Box } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';

interface Product {
    id: number;
    name: string;
    image_url: string;
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: Product;
}

interface Order {
    id: number;
    created_at: string;
    total_amount: number;
    status: string;
    items: OrderItem[];
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    pending: { color: 'text-yellow-400', icon: <Clock size={16} />, label: 'Pending' },
    paid: { color: 'text-blue-400', icon: <CheckCircle size={16} />, label: 'Paid' },
    processing: { color: 'text-purple-400', icon: <Box size={16} />, label: 'Processing' },
    shipped: { color: 'text-cyan-400', icon: <Truck size={16} />, label: 'Shipped' },
    delivered: { color: 'text-success', icon: <CheckCircle size={16} />, label: 'Delivered' },
    cancelled: { color: 'text-error', icon: <X size={16} />, label: 'Cancelled' },
};

export default function Orders() {
    const { user, isLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" />;

    if (loading) {
        return (
            <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
                <Skeleton className="h-10 w-48 mb-8" />
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-md" />
                    ))}
                </div>
            </div>
        );
    }

    const getStatus = (status: string) => statusConfig[status] || statusConfig.pending;

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <h5 className="text-accent mb-2">My Account</h5>
                    <h1 className="text-3xl sm:text-4xl font-serif font-semibold">Order History</h1>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-secondary rounded-lg border border-glass-border"
                    >
                        <Package size={48} className="mx-auto text-muted mb-4" />
                        <p className="text-text-secondary text-lg mb-2">No orders yet</p>
                        <p className="text-muted text-sm">Start shopping to see your orders here</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => {
                            const status = getStatus(order.status);
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedOrder(order)}
                                    className="group bg-secondary border border-glass-border rounded-lg p-5 cursor-pointer hover:border-accent/50 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {/* Order Images Preview */}
                                            <div className="flex -space-x-3 shrink-0">
                                                {order.items.slice(0, 3).map((item, i) => (
                                                    <div
                                                        key={item.id}
                                                        className="w-12 h-12 rounded-full border-2 border-secondary overflow-hidden bg-tertiary"
                                                        style={{ zIndex: 3 - i }}
                                                    >
                                                        <img
                                                            src={item.product?.image_url}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="w-12 h-12 rounded-full border-2 border-secondary bg-tertiary flex items-center justify-center text-xs text-muted">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-text">Order #{order.id}</span>
                                                    <span className={`flex items-center gap-1 text-xs ${status.color}`}>
                                                        {status.icon}
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-serif text-accent">
                                                ${Number(order.total_amount).toFixed(2)}
                                            </span>
                                            <ChevronRight
                                                size={20}
                                                className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:w-full bg-secondary border border-glass-border rounded-xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b border-glass-border">
                                <div>
                                    <h3 className="text-xl font-serif font-semibold">Order #{selectedOrder.id}</h3>
                                    <p className="text-sm text-muted mt-1">
                                        {new Date(selectedOrder.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-glass rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Status Badge */}
                            <div className="px-6 py-4 bg-glass border-b border-glass-border">
                                {(() => {
                                    const status = getStatus(selectedOrder.status);
                                    return (
                                        <div className={`flex items-center gap-2 ${status.color}`}>
                                            {status.icon}
                                            <span className="font-medium">{status.label}</span>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Order Items */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {selectedOrder.items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-20 bg-tertiary rounded overflow-hidden shrink-0">
                                            <img
                                                src={item.product?.image_url}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-text truncate">
                                                {item.product?.name}
                                            </h4>
                                            <p className="text-sm text-muted mt-1">Qty: {item.quantity}</p>
                                            <p className="text-accent font-serif mt-1">
                                                ${Number(item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-glass-border bg-tertiary">
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Total</span>
                                    <span className="text-2xl font-serif text-accent">
                                        ${Number(selectedOrder.total_amount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
