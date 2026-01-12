import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Layers, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface AdminSidebarProps {
    className?: string;
    isMobile?: boolean;
    onItemClick?: () => void;
}

export default function AdminSidebar({ className, isMobile, onItemClick }: AdminSidebarProps) {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: Layers, label: 'Collections', path: '/admin/collections' },
        { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        // { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    ];

    return (
        <aside className={cn("w-72 bg-secondary border-r border-glass-border flex-col fixed inset-y-0 z-0", className)}>
            {!isMobile && (
                <div className="h-20 flex items-center px-8 border-b border-glass-border">
                    <Link to="/admin" className="text-2xl font-serif font-semibold tracking-tight">
                        LUXE<span className="text-accent">.</span> <span className="text-xs text-muted font-sans ml-2 tracking-widest opacity-70">ADMIN</span>
                    </Link>
                </div>
            )}

            <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    // Check active state more strictly to avoid partial matches incorrectly highlighting
                    const isActive = item.path === '/admin'
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onItemClick}
                            className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                                isActive
                                    ? 'bg-accent text-primary shadow-lg shadow-accent/20'
                                    : 'text-muted hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-primary' : 'text-muted group-hover:text-white transition-colors'} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-glass-border">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-sm font-medium text-muted hover:bg-error/10 hover:text-error transition-all duration-300 group"
                >
                    <LogOut size={20} className="group-hover:text-error transition-colors" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
