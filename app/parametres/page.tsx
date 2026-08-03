'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Check } from 'lucide-react';

const DEVISES = ['MGA', 'EUR', 'USD'];

export default function ParametresPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nom_entreprise: '',
    adresse: '',
    telephone: '',
    email: '',
    tva_defaut: 20,
    devise: 'MGA',
    couleur_principale: '#111827',
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('parametres').select('*').eq('id', 1).single();
      if (data) {
        setForm({
          nom_entreprise: data.nom_entreprise || '',
          adresse: data.adresse || '',
          telephone: data.telephone || '',
          email: data.email || '',
          tva_defaut: data.tva_defaut ?? 20,
          devise: data.devise || 'MGA',
          couleur_principale: data.couleur_principale || '#111827',
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const update = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('parametres').update(form).eq('id', 1);
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      alert('Erreur : ' + error.message);
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Chargement...</p>;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Paramètres</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Ces informations apparaîtront sur tous les devis et factures.</p>

      <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom entreprise</label>
            <input value={form.nom_entreprise} onChange={(e) => update('nom_entreprise', e.target.value)} className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
            <input value={form.telephone} onChange={(e) => update('telephone', e.target.value)} className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse</label>
            <input value={form.adresse} onChange={(e) => update('adresse', e.target.value)} className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input value={form.email} onChange={(e) => update('email', e.target.value)} type="email" className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">TVA (%)</label>
            <input value={form.tva_defaut} onChange={(e) => update('tva_defaut', Number(e.target.value))} type="number" className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Devise</label>
            <select value={form.devise} onChange={(e) => update('devise', e.target.value)} className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {DEVISES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Couleur principale</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.couleur_principale} onChange={(e) => update('couleur_principale', e.target.value)} className="h-9 w-12 rounded-lg border-0 cursor-pointer" />
              <span className="text-sm text-gray-500">{form.couleur_principale}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-700 bg-green-100 rounded-full px-3 py-1.5">
              <Check size={16} /> Enregistré
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
