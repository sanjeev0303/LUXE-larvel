import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Skeleton } from '../ui/Skeleton';
import { Plus, Search, Edit, Trash2, X, Upload } from 'lucide-react';

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', collection_id: '', sizes: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, collectionsRes] = await Promise.all([
                api.get('/products'),
                api.get('/collections')
            ]);
            setProducts(productsRes.data);
            setCollections(collectionsRes.data);
        } catch (e) {
            console.error("Failed to fetch data", e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('stock', formData.stock);
            if (formData.collection_id) {
                data.append('collection_id', formData.collection_id);
            }
            if (formData.sizes) {
                const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
                sizesArray.forEach(size => data.append('sizes[]', size));
            }
            if (imageFile) {
                data.append('image', imageFile);
            }

            await api.post('/admin/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setIsFormOpen(false);
            setFormData({ name: '', description: '', price: '', stock: '', collection_id: '', sizes: '' });
            setImageFile(null);
            fetchData();
        } catch (e) {
            console.error(e);
            alert('Failed to create product.');
        }
    };

    const handleDelete = async (id: number) => {
        if(confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/admin/products/${id}`);
                fetchData();
            } catch (e) {
                console.error(e);
                alert('Failed to delete product.');
            }
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
         return (
             <div className="space-y-4">
                 <div className="flex justify-between">
                     <Skeleton className="h-10 w-48" />
                     <Skeleton className="h-10 w-32" />
                 </div>
                 <div className="space-y-2">
                     {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                 </div>
             </div>
         );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 input-field w-full sm:w-64"
                    />
                </div>
                <button onClick={() => setIsFormOpen(true)} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add Product
                </button>
            </div>

            <div className="bg-secondary/50 border border-glass-border rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-glass-border text-xs uppercase tracking-wider text-muted font-medium">
                            <tr>
                                <th className="p-4 pl-6">Product</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProducts.map(p => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-tertiary overflow-hidden">
                                                <img src={p.image_url} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-text">{p.name}</p>
                                                <p className="text-xs text-muted">ID: #{p.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">${Number(p.price).toFixed(2)}</td>
                                    <td className="p-4">{p.stock}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${p.stock > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                            {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white/10 rounded-full text-muted hover:text-text transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-error/10 rounded-full text-muted hover:text-error transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-muted">
                        No products found matching your search.
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary border border-glass-border rounded-xl shadow-2xl p-6 max-w-lg w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-serif">Add New Product</h3>
                            <button onClick={() => setIsFormOpen(false)} className="text-muted hover:text-text">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted tracking-wider">Product Name</label>
                                <input className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted tracking-wider">Description</label>
                                <textarea className="input-field min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-muted tracking-wider">Price ($)</label>
                                    <input type="number" step="0.01" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-muted tracking-wider">Stock Qty</label>
                                    <input type="number" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted tracking-wider">Sizes (Comma separated)</label>
                                <input
                                    className="input-field"
                                    placeholder="e.g. S, M, L, XL"
                                    value={formData.sizes}
                                    onChange={e => setFormData({...formData, sizes: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted tracking-wider">Collection</label>
                                <select
                                    className="input-field bg-secondary" // Ensure background contrast
                                    value={formData.collection_id}
                                    onChange={e => setFormData({...formData, collection_id: e.target.value})}
                                >
                                    <option value="">Select Collection</option>
                                    {collections.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-xs uppercase text-muted tracking-wider">Product Image</label>
                                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 hover:bg-white/5 transition-colors text-center cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={e => {
                                            if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                                        }}
                                        required
                                    />
                                    <div className="flex flex-col items-center gap-2 text-muted">
                                        <Upload size={24} />
                                        <span className="text-sm">{imageFile ? imageFile.name : 'Click to upload image'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="btn-outline">Cancel</button>
                                <button type="submit" className="btn-primary">Create Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
