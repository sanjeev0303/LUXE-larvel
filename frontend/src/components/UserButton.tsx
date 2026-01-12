import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, LayoutDashboard, ChevronDown, Package, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserButton() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-white/5 py-2 px-3 rounded-full transition-colors"
      >
        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent">
            <User size={18} />
        </div>
        <span className="text-sm font-medium hidden md:block">{user.name}</span>
        <ChevronDown size={14} className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
             <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-56 bg-secondary border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/5">
                <p className="font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-neutral-400 truncate">{user.email}</p>
              </div>

              <div className="p-2">
                {user.is_admin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                  >
                    <Settings size={16} />
                    <span>Profile Settings</span>
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                >
                  <Package size={16} />
                  <span>My Orders</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
