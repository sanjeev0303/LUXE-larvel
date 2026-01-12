import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Package } from 'lucide-react';

export default function AdminDashboard() {
    const [stats] = useState({
        totalRevenue: 24500,
        totalOrders: 156,
        totalProducts: 42,
        totalUsers: 89
    });
    const [salesData] = useState([
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 2000 },
        { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 1890 },
        { name: 'Sat', sales: 2390 },
        { name: 'Sun', sales: 3490 },
    ]);
    const [loading] = useState(false); // Simulated active state for now

    // In a real app, I'd fetch these from the backend.
    // Using simulated data for the "Bento Grid" visualization as per the aesthetic requirements immediately.

    if (loading) return <div className="p-8">Loading...</div>;

    const COLORS = ['#D4AF37', '#ffffff', '#525252', '#000000'];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-serif font-medium text-text mb-8">Dashboard Overview</h2>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-secondary/50 border border-glass-border p-6 rounded-2xl flex flex-col justify-between h-40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={64} />
                    </div>
                    <div>
                        <p className="text-muted text-sm uppercase tracking-wider font-medium">Total Revenue</p>
                        <h3 className="text-3xl font-serif mt-2">${stats.totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-success text-sm font-medium">
                        <TrendingUp size={16} /> +12.5% <span className="text-muted font-normal ml-1">from last month</span>
                    </div>
                </div>

                 <div className="bg-secondary/50 border border-glass-border p-6 rounded-2xl flex flex-col justify-between h-40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag size={64} />
                    </div>
                    <div>
                        <p className="text-muted text-sm uppercase tracking-wider font-medium">Total Orders</p>
                        <h3 className="text-3xl font-serif mt-2">{stats.totalOrders}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-success text-sm font-medium">
                        <TrendingUp size={16} /> +8.2% <span className="text-muted font-normal ml-1">from last month</span>
                    </div>
                </div>

                 <div className="bg-secondary/50 border border-glass-border p-6 rounded-2xl flex flex-col justify-between h-40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Package size={64} />
                    </div>
                    <div>
                        <p className="text-muted text-sm uppercase tracking-wider font-medium">Total Products</p>
                        <h3 className="text-3xl font-serif mt-2">{stats.totalProducts}</h3>
                    </div>
                     <div className="flex items-center gap-2 text-text text-sm font-medium">
                        <span className="text-muted font-normal">Active Inventory</span>
                    </div>
                </div>

                 <div className="bg-secondary/50 border border-glass-border p-6 rounded-2xl flex flex-col justify-between h-40 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Users size={64} />
                    </div>
                    <div>
                        <p className="text-muted text-sm uppercase tracking-wider font-medium">Total Users</p>
                        <h3 className="text-3xl font-serif mt-2">{stats.totalUsers}</h3>
                    </div>
                     <div className="flex items-center gap-2 text-success text-sm font-medium">
                        <TrendingUp size={16} /> +4.3% <span className="text-muted font-normal ml-1">new users</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-secondary/50 border border-glass-border p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium">Revenue Analytics</h3>
                        <select className="bg-tertiary border-none text-xs rounded px-2 py-1 outline-none">
                            <option>This Week</option>
                            <option>Last Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sales by Category (Pie Chart) */}
                <div className="bg-secondary/50 border border-glass-border p-6 rounded-2xl">
                    <h3 className="text-lg font-medium mb-6">Sales by Category</h3>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Apparel', value: 400 },
                                        { name: 'Accessories', value: 300 },
                                        { name: 'Footwear', value: 300 },
                                        { name: 'Jewelry', value: 200 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {salesData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center text overlay */}
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8 text-center">
                            <div>
                                <span className="block text-2xl font-serif font-bold">1200</span>
                                <span className="text-xs text-muted">Total Sales</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Mini Table can go here */}
             <div className="bg-secondary/50 border border-glass-border p-6 rounded-2xl">
                 <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                 <div className="space-y-4">
                     {[1, 2, 3].map((i) => (
                         <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                     <ShoppingBag size={18} />
                                 </div>
                                 <div>
                                     <p className="text-sm font-medium">New order #102{i} placed</p>
                                     <p className="text-xs text-muted">2 minutes ago</p>
                                 </div>
                             </div>
                             <span className="text-sm font-medium text-success">+$245.00</span>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    );
}
