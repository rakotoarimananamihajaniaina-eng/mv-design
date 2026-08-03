'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Search, Pencil, Download, Trash2 } from 'lucide-react';

const formatAr = (n: number) => `Ar ${Number(n || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })}`;

const TYPE_STYLES: Record<string, string> = {
  devis: 'bg-blue-50 text-blue-600',
  facture: 'bg-green-50 text-green-600',
};

const STATUT_COLORS: Record<string, string> = {
  brouillon: 'text-gray-500',
  en_attente: 'text-amber-600',
  accepte: 'text-green-600',
  refuse: 'text-red-600',
  impayee: 'text-red-600',
  payee: 'text-green-600',
  partielle: 'text-amber-600',
};

const STATUT_LABELS: Record<string, string> = {
  brouillon: 'Brouillon',
  en_attente: 'En attente',
  accepte: 'Accepté',
  refuse: 'Refusé',
  impayee: 'Impayée',
  payee: 'Payée',
  partielle: 'Partielle',
};

type DocRow = {
  id: string;
  type: string;
  reference: string;
  date: string;
  objet: string | null;
  sous_total: number;
  total_ttc: number;
  statut: string;
  clients: { nom: string } | null;
};

export default function DocumentsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'tous' | 'devis' | 'facture'>('tous');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('id, type, reference, date, objet, sous_total, total_ttc, statut, clients(nom)')
      .order('created_at', { ascending: false });
    if (!error && data) setDocs(data as unknown as DocRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce document ?')) return;
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (!error) setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const filtered = docs.filter((d) => {
    const matchesType = typeFilter === 'tous' || d.type === typeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      d.reference.toLowerCase().includes(q) ||
      (d.clients?.nom || '').toLowerCase().includes(q) ||
      (d.objet || '').toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Devis et factures</p>
        </div>
        
          href="/documents/nouveau"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Nouveau document
        </a>
      </div>

      <div className="flex items-center gap-6 border-b border-gray-200 mb-4">
        {(['tous', 'devis', 'facture'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              typeFilter === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'tous' ? 'Tous' : t === 'devis' ? 'Devis' : 'Factures'}
          </button>
        ))}
      </div>

      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par référence, client, objet..."
          className="w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-200">
              <th className="px-5 py-3 font-medium whitespace-nowrap">Référence</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Type</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Date</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Client</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Objet</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">HT</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">TTC</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Statut</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">
                  Chargement...
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">{d.reference}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_STYLES[d.type] || 'bg-gray-50 text-gray-600'}`}>
                      {d.type === 'devis' ? 'Devis' : 'Facture'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{d.date}</td>
                  <td className="px-5 py-3.5 text-gray-900 whitespace-nowrap">{d.clients?.nom || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate">{d.objet || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{formatAr(d.sous_total)}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">{formatAr(d.total_ttc)}</td>
                  <td className={`px-5 py-3.5 font-medium whitespace-nowrap ${STATUT_COLORS[d.statut] || 'text-gray-500'}`}>
                    {STATUT_LABELS[d.statut] || d.statut}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/documents/${d.id}`} className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <Pencil size={15} />
                      </a>
                      <button className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <Download size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">
                  Aucun document pour l'instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
