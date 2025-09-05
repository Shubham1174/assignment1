import api from '../api/client.js';
import { useEffect, useState } from 'react';

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '' });
  const [editingId, setEditingId] = useState(null);
  const load = () => api.get('/products').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editingId) {
      await api.put(`/products/${editingId}`, { ...form, price: Number(form.price) });
    } else {
      await api.post('/products', { ...form, price: Number(form.price) });
    }
    setForm({ name: '', description: '', price: '', category: '' });
    setEditingId(null);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Products</h1>
      <div className="space-y-2 max-w-lg">
        <input className="border p-2 w-full" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea className="border p-2 w-full" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <div className="pt-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={save}>{editingId ? 'Update' : 'Add'}</button>
          {editingId && (
            <button className="ml-2 bg-gray-500 text-white px-4 py-2 rounded" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', category: '' }); }}>Cancel</button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {items.map((p) => (
          <div key={p._id} className="border p-4">
            <h3 className="font-semibold">{p.name}</h3>
            <p>${p.price}</p>
            <div className="flex gap-2 mt-2">
              <button className="bg-gray-600 text-white px-3 py-1 rounded" onClick={() => { setEditingId(p._id); setForm({ name: p.name, description: p.description, price: String(p.price), category: p.category }); }}>Edit</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => remove(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


