import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchAllMenu, createMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability, type MenuItem } from "../lib/api";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface FormData { name: string; description: string; price: string; category: string; available: boolean; imageUrl: string; }
const emptyForm: FormData = { name: "", description: "", price: "", category: "Starters", available: true, imageUrl: "" };
const categories = ["Starters", "Main Course", "Breads", "Rice & Biryani", "Desserts", "Drinks"];

function ItemForm({ initial, onSubmit, onCancel, loading }: { initial: FormData; onSubmit: (d: FormData) => void; onCancel: () => void; loading: boolean }) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof FormData, v: any) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl font-bold text-clay-900">{initial.name ? "Edit Item" : "Add New Item"}</h3>
          <button onClick={onCancel} className="p-2 hover:bg-clay-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-bold text-clay-700 mb-1">Name *</label><input className="input-field" value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div><label className="block text-sm font-bold text-clay-700 mb-1">Description *</label><textarea className="input-field resize-none" rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-clay-700 mb-1">Price (₹) *</label><input type="number" className="input-field" value={form.price} onChange={(e) => set("price", e.target.value)} /></div>
            <div><label className="block text-sm font-bold text-clay-700 mb-1">Category *</label>
              <select className="input-field" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div><label className="block text-sm font-bold text-clay-700 mb-1">Image URL</label><input className="input-field" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="Optional" /></div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-10 h-6 rounded-full transition-colors ${form.available ? "bg-green-500" : "bg-clay-300"} relative`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${form.available ? "translate-x-5" : "translate-x-1"}`} />
            </div>
            <span className="text-sm font-bold text-clay-700">{form.available ? "Available" : "Unavailable"}</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
          <button onClick={() => onSubmit(form)} disabled={loading || !form.name || !form.description || !form.price} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            {initial.name ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMenuPage() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["menu", "all"], queryFn: fetchAllMenu });
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const addMut = useMutation({ mutationFn: (d: any) => createMenuItem(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ["menu"] }); setShowAdd(false); } });
  const editMut = useMutation({ mutationFn: ({ id, ...d }: any) => updateMenuItem(id, d), onSuccess: () => { qc.invalidateQueries({ queryKey: ["menu"] }); setEditItem(null); } });
  const delMut = useMutation({ mutationFn: deleteMenuItem, onSuccess: () => { qc.invalidateQueries({ queryKey: ["menu"] }); setDeleteId(null); } });
  const togMut = useMutation({ mutationFn: ({ id, available }: { id: number; available: boolean }) => toggleAvailability(id, available), onSuccess: () => qc.invalidateQueries({ queryKey: ["menu"] }) });

  const grouped = categories.reduce((acc, cat) => { acc[cat] = items.filter((i) => i.category === cat); return acc; }, {} as Record<string, MenuItem[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-clay-900 mb-1">Menu Management</h1>
          <p className="text-clay-500">{items.length} items across {categories.length} categories</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Item</button>
      </div>

      {isLoading && <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="warm-card p-6 shimmer h-16" />)}</div>}

      {categories.map((cat) => {
        const catItems = grouped[cat] || [];
        if (catItems.length === 0) return null;
        return (
          <div key={cat} className="mb-8">
            <h2 className="font-heading text-xl font-bold text-clay-900 mb-4 flex items-center gap-2">
              {cat} <span className="text-sm font-body text-clay-400">({catItems.length})</span>
            </h2>
            <div className="space-y-3">
              {catItems.map((item) => (
                <div key={item.id} className="warm-card p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-heading font-bold ${item.available ? "text-clay-900" : "text-clay-400 line-through"}`}>{item.name}</h3>
                      <span className="text-saffron-600 font-bold">₹{item.price}</span>
                    </div>
                    <p className="text-sm text-clay-500 truncate">{item.description}</p>
                  </div>
                  <button onClick={() => togMut.mutate({ id: item.id, available: !item.available })}
                    className={`w-10 h-6 rounded-full transition-colors ${item.available ? "bg-green-500" : "bg-clay-300"} relative flex-shrink-0`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${item.available ? "translate-x-5" : "translate-x-1"}`} />
                  </button>
                  <button onClick={() => setEditItem(item)} className="p-2 hover:bg-clay-100 rounded-lg text-clay-500"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-clay-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add Dialog */}
      {showAdd && <ItemForm initial={emptyForm} loading={addMut.isPending} onCancel={() => setShowAdd(false)} onSubmit={(d) => addMut.mutate({ name: d.name, description: d.description, price: parseFloat(d.price), category: d.category, available: d.available, imageUrl: d.imageUrl || undefined })} />}

      {/* Edit Dialog */}
      {editItem && <ItemForm initial={{ name: editItem.name, description: editItem.description, price: String(editItem.price), category: editItem.category, available: editItem.available, imageUrl: editItem.imageUrl || "" }} loading={editMut.isPending} onCancel={() => setEditItem(null)} onSubmit={(d) => editMut.mutate({ id: editItem.id, name: d.name, description: d.description, price: parseFloat(d.price), category: d.category, available: d.available, imageUrl: d.imageUrl || undefined })} />}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading text-xl font-bold text-clay-900 mb-2">Delete Item?</h3>
            <p className="text-clay-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={() => delMut.mutate(deleteId)} className="bg-red-500 text-white font-bold px-6 py-3 rounded-classical hover:bg-red-600 transition-colors flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
