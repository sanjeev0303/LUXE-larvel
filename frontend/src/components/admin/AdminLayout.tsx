import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    const getPageTitle = () => {
        if (location.pathname === '/admin') return 'Dashboard';
        if (location.pathname.startsWith('/admin/products')) return 'Products';
        if (location.pathname.startsWith('/admin/collections')) return 'Collections';
        if (location.pathname.startsWith('/admin/orders')) return 'Orders';
        if (location.pathname.startsWith('/admin/users')) return 'Users';
        return 'Admin';
    };

    return (
        <div className="min-h-screen bg-primary text-text flex">
            {/* Desktop Sidebar */}
            <AdminSidebar className="hidden md:flex" />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-72 bg-secondary border-r border-glass-border transform transition-transform duration-300 z-50 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <div className="h-20 flex items-center justify-between px-6 border-b border-glass-border">
                    <Link to="/admin" className="text-xl font-serif font-semibold">
                        LUXE<span className="text-accent">.</span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-muted hover:text-text">
                        <X size={24} />
                    </button>
                </div>
                <div className="h-full">
                     <AdminSidebar isMobile onItemClick={() => setIsMobileMenuOpen(false)} />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 min-w-0 flex flex-col min-h-screen transition-all duration-300">
                {/* Header */}
                <header className="h-20 border-b border-glass-border bg-primary/95 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 text-muted hover:text-text"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-medium tracking-tight font-serif">{getPageTitle()}</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-muted hover:text-text transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-primary"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-glass-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium leading-none mb-1">{user?.name}</p>
                                <p className="text-xs text-muted">Administrator</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-serif text-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 sm:p-8 grow overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
