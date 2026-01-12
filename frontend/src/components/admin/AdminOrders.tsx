import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Skeleton } from '../ui/Skeleton';
import { Search, Eye } from 'lucide-react';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/orders');
            setOrders(res.data);
        } catch (e) {
            console.error("Failed to fetch orders", e);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            // Optimistic update
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
            await api.patch(`/admin/orders/${id}/status`, { status: newStatus });
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Failed to update order status.');
            fetchOrders(); // Revert on failure
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            paid: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            processing: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
            shipped: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
            delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
            cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
        }[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';

        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles} capitalize`}>
                {status}
            </span>
        );
    };

    const filteredOrders = orders.filter(o =>
        o.id.toString().includes(searchTerm) ||
        o.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
               <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 input-field w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="bg-secondary/50 border border-glass-border rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-glass-border text-xs uppercase tracking-wider text-muted font-medium">
                            <tr>
                                <th className="p-4 pl-6">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Payment</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.map(o => (
                                <tr key={o.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 pl-6 font-medium">#{o.id}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-text">{o.user?.name || 'Guest'}</span>
                                            <span className="text-xs text-muted">ID: {o.user_id}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-serif text-lg">${Number(o.total_amount).toFixed(2)}</td>
                                    <td className="p-4 text-xs font-mono text-muted">{o.stripe_payment_id?.slice(-8).toUpperCase() || 'N/A'}</td>
                                    <td className="p-4">
                                        <StatusBadge status={o.status} />
                                        <select
                                            value={o.status}
                                            onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                                            className="ml-2 bg-transparent text-xs font-medium uppercase tracking-wide border border-glass-border rounded px-2 py-1 focus:border-accent text-muted focus:text-accent outline-none cursor-pointer"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-sm text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 text-right pr-6">
                                        <button className="p-2 hover:bg-white/10 rounded-full text-muted hover:text-text transition-colors">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOrders.length === 0 && (
                     <div className="text-center py-12 text-muted">
                        No orders found.
                    </div>
                )}
            </div>
        </div>
    );
}
