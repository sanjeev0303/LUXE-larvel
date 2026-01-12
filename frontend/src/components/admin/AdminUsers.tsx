import { useState } from 'react';
import { Mail, Shield } from 'lucide-react';

export default function AdminUsers() {
    // Mock users for now since we don't have a user list endpoint ready?
    // Or we can use a dummy list.
    const [users] = useState([
        { id: 1, name: 'Sanju', email: 'sanju@example.com', role: 'admin', joined: '2024-01-01' },
        { id: 2, name: 'John Doe', email: 'john@example.com', role: 'customer', joined: '2024-01-15' },
        { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', joined: '2024-01-20' },
    ]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif">Users</h2>

            <div className="bg-secondary/50 border border-glass-border rounded-xl overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-glass-border text-xs uppercase tracking-wider text-muted font-medium">
                        <tr>
                            <th className="p-4 pl-6">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-right pr-6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-text">{u.name}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-muted">
                                                <Mail size={12} />
                                                {u.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                        u.role === 'admin'
                                            ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                            : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                    }`}>
                                        {u.role === 'admin' && <Shield size={10} />}
                                        <span className="capitalize">{u.role}</span>
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-muted">{u.joined}</td>
                                <td className="p-4 text-right pr-6">
                                    <span className="text-success text-xs font-medium bg-success/10 px-2 py-1 rounded">Active</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
