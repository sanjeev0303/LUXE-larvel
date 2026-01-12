import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Skeleton } from '../ui/Skeleton';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function AdminCollections() {
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', slug: '' });

    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const res = await api.get('/collections');
            setCollections(res.data);
        } catch (e) {
            console.error("Failed to fetch collections", e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.title);
            data.append('description', formData.description);
            // Auto generate slug if not provided, or handle it
            const slug = formData.slug || formData.title.toLowerCase().replace(/ /g, '-');
            data.append('slug', slug);

            if (imageFile) {
                data.append('image', imageFile);
            }

            await api.post('/admin/collections', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsFormOpen(false);
            setFormData({ title: '', description: '', slug: '' });
            setImageFile(null);
            fetchCollections();
        } catch (e) {
            console.error(e);
            alert('Failed to create collection.');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-40" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-4/3 rounded-xl overflow-hidden">
                             <Skeleton className="w-full h-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif">Collections</h2>
                <button onClick={() => setIsFormOpen(true)} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add Collection
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map(c => (
                    <div key={c.id} className="group relative bg-secondary border border-glass-border rounded-xl overflow-hidden aspect-4/3">
                        <img src={c.image_url} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                            <h3 className="text-xl font-serif text-white">{c.title}</h3>
                            <p className="text-sm text-white/80 line-clamp-1">{c.description}</p>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 text-white">
                                <Edit size={16} />
                            </button>
                             <button className="p-2 bg-error/80 backdrop-blur rounded-full hover:bg-error text-white">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

             {/* Create Modal Skeleton */}
             {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-secondary p-8 max-w-md w-full border border-glass-border rounded-xl">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-serif">New Collection</h3>
                            <button onClick={() => setIsFormOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted tracking-wider">Title</label>
                                <input className="input-field" placeholder="Autumn Collection" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted tracking-wider">Description</label>
                                <textarea className="input-field" placeholder="Collection description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs uppercase text-muted tracking-wider">Slug (Optional)</label>
                                <input className="input-field" placeholder="autumn-collection" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted tracking-wider">Cover Image</label>
                                <input
                                    type="file"
                                    className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                                    accept="image/*"
                                    onChange={e => {
                                        if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                                    }}
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="btn-outline">Cancel</button>
                                <button type="submit" className="btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
