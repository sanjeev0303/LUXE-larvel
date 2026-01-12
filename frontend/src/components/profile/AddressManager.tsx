import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Plus, MapPin, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Address {
    id: number;
    user_id: number;
    name: string;
    email?: string;
    mobile: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    is_default: boolean;
}

export default function AddressManager() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        is_default: false
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/addresses');
            setAddresses(response.data);
        } catch (error) {
            console.error("Failed to fetch addresses");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (addr: Address) => {
        setEditingAddress(addr);
        setFormData({
            name: addr.name,
            email: addr.email || '',
            mobile: addr.mobile,
            address_line1: addr.address_line1,
            address_line2: addr.address_line2 || '',
            city: addr.city,
            state: addr.state,
            zip: addr.zip,
            country: addr.country,
            is_default: addr.is_default
        });
        setIsFormOpen(true);
        // Scroll to form
        document.getElementById('address-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if(!confirm('Are you sure checking delete?')) return;
        try {
            await api.delete(`/addresses/${id}`);
            setAddresses(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error("Failed to delete");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                const response = await api.put(`/addresses/${editingAddress.id}`, formData);
                // Update local state
                setAddresses(prev => prev.map(a => a.id === editingAddress.id ? response.data : a));
                // If set to default, update others
                if (response.data.is_default) {
                    fetchAddresses(); // Easiest way to sync default status
                }
            } else {
                const response = await api.post('/addresses', formData);
                if (response.data.is_default) {
                    fetchAddresses();
                } else {
                    setAddresses([...addresses, response.data]);
                }
            }
            setIsFormOpen(false);
            setEditingAddress(null);
            resetForm();
        } catch (error) {
            console.error("Failed to save address");
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            mobile: '',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            is_default: false
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif">Address Book</h2>
                {!isFormOpen && (
                    <button
                        onClick={() => { setEditingAddress(null); resetForm(); setIsFormOpen(true); }}
                        className="btn-outline flex items-center gap-2"
                    >
                        <Plus size={16} /> Add New
                    </button>
                )}
            </div>

            {/* Address Grid */}
            {!isFormOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map(addr => (
                        <div key={addr.id} className={`p-6 rounded-lg border ${addr.is_default ? 'border-accent bg-accent/5' : 'border-glass-border bg-secondary'} relative group`}>
                            {addr.is_default && (
                                <span className="absolute top-4 right-4 text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-1 rounded">Default</span>
                            )}
                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className="mt-1 text-muted" size={18} />
                                <div>
                                    <h4 className="font-medium text-lg">{addr.name}</h4>
                                    <p className="text-sm text-text-secondary">{addr.mobile}</p>
                                </div>
                            </div>
                            <div className="text-muted text-sm leading-relaxed mb-6 pl-8">
                                <p>{addr.address_line1}</p>
                                {addr.address_line2 && <p>{addr.address_line2}</p>}
                                <p>{addr.city}, {addr.state} {addr.zip}</p>
                                <p>{addr.country}</p>
                            </div>
                            <div className="flex gap-3 pl-8">
                                <button onClick={() => handleEdit(addr)} className="text-sm text-text hover:text-accent flex items-center gap-1 transition-colors">
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(addr.id)} className="text-sm text-text hover:text-error flex items-center gap-1 transition-colors">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {addresses.length === 0 && !isLoading && (
                        <p className="text-muted py-8 col-span-full text-center">No addresses saved yet.</p>
                    )}
                </div>
            )}

            {/* Address Form */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        id="address-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-secondary border border-glass-border rounded-lg p-6 overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-medium">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                            <button onClick={() => setIsFormOpen(false)} className="text-muted hover:text-text">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted">Full Name</label>
                                <input className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted">Mobile Number</label>
                                <input className="input-field" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs uppercase tracking-wider text-muted">Address Line 1</label>
                                <input className="input-field" required value={formData.address_line1} onChange={e => setFormData({...formData, address_line1: e.target.value})} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs uppercase tracking-wider text-muted">Address Line 2 (Optional)</label>
                                <input className="input-field" value={formData.address_line2} onChange={e => setFormData({...formData, address_line2: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted">City</label>
                                <input className="input-field" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted">State</label>
                                <input className="input-field" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted">ZIP Code</label>
                                <input className="input-field" required value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted">Country</label>
                                <input className="input-field" required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                            </div>
                            <div className="md:col-span-2 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_default}
                                        onChange={e => setFormData({...formData, is_default: e.target.checked})}
                                        className="rounded border-glass-border bg-tertiary text-accent focus:ring-accent"
                                    />
                                    <span className="text-sm text-text">Set as default address</span>
                                </label>
                            </div>
                            <div className="md:col-span-2 pt-4 flex gap-4">
                                <button type="submit" className="btn-primary flex-1">Save Address</button>
                                <button type="button" onClick={() => setIsFormOpen(false)} className="btn-outline flex-1">Cancel</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
