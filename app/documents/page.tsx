'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Search, Pencil, Download, Trash2 } from 'lucide-react';

function formatAr(n) {
  return 'Ar ' + Number(n || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 });
}

var TYPE_STYLES = {
  devis: 'bg-blue-50 text-blue-600',
  facture: 'bg-green-50 text-green-600',
};

var STATUT_COLORS = {
  brouillon: 'text-gray-500',
  en_attente: 'text-amber-600',
  accepte: 'text-green-600',
  refuse: 'text-red-600',
  impayee: 'text-red-600',
  payee: 'text-green-600',
  partielle: 'text-amber-600',
};

var STATUT_LABELS = {
  brouillon: 'Brouillon',
  en_attente: 'En attente',
  accepte: 'Accepté',
  refuse: 'Refusé',
  impayee: 'Impayée',
  payee: 'Payée',
  partielle: 'Partielle',
};

var TABS = ['tous', 'devis', 'facture'];

export default function DocumentsPage() {
  var supabase = createClient();
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var docsState = useState([]);
  var docs = docsState[0];
  var setDocs = docsState[1];

  var searchState = useState('');
  var search = searchState[0];
  var setSearch = searchState[1];

  var typeFilterState = useState('tous');
  var typeFilter = typeFilterState[0];
  var setTypeFilter = typeFilterState[1];

  function load() {
    setLoading(true);
    supabase
      .from('documents')
      .select('id, type, reference, date, objet, sous_total, total_ttc, statut, clients(nom)')
      .order('created_at', { ascending: false })
      .then(function (result) {
        if (!result.error && result.data) {
          setDocs(result.data);
        }
        setLoading(false);
      });
  }

  useEffect(function () {
    load();
  }, []);

  function handleDelete(id) {
    var ok = confirm('Supprimer ce document ?');
    if (!ok) return;
    supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .then(function (result) {
        if (!result.error) {
          setDocs(docs.filter(function (d) {
            return d.id !== id;
          }));
        }
      });
  }

  var q = search.toLowerCase();
  var filtered = docs.filter(function (d) {
    var matchesType = typeFilter === 'tous' || d.type === typeFilter;
    var clientNom = d.clients && d.clients.nom ? d.clients.nom : '';
    var matchesSearch =
      d.reference.toLowerCase().indexOf(q) !== -1 ||
      clientNom.toLowerCase().indexOf(q) !== -1 ||
      (d.objet || '').toLowerCase().indexOf(q) !== -1;
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
          <Plus size={16} />
          Nouveau document
        </a>
      </div>

      <div className="flex items-center gap-6 border-b border-gray-200 mb-4">
        {TABS.map(function (t) {
          var label = t === 'tous' ? 'Tous' : t === 'devis' ? 'Devis' : 'Factures';
          var isActive = typeFilter === t;
          var tabClass = isActive
            ? 'pb-3 text-sm font-medium border-b-2 -mb-px transition-colors border-blue-600 text-blue-600'
            : 'pb-3 text-sm font-medium border-b-2 -mb-px transition-colors border-transparent text-gray-500 hover:text-gray-700';
          return (
            <button key={t} onClick={function () { setTypeFilter(t); }} className={tabClass}>
              {label}
            </button>
          );
        })}
      </div>

      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={function (e) { setSearch(e.target.value); }}
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
            {!loading && filtered.map(function (d) {
              var clientNom = d.clients && d.clients.nom ? d.clients.nom : '—';
              var typeStyle = TYPE_STYLES[d.type] || 'bg-gray-50 text-gray-600';
              var statutColor = STATUT_COLORS[d.statut] || 'text-gray-500';
              var statutLabel = STATUT_LABELS[d.statut] || d.statut;
              return (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">{d.reference}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={'px-2.5 py-1 rounded-full text-xs font-medium ' + typeStyle}>
                      {d.type === 'devis' ? 'Devis' : 'Facture'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{d.date}</td>
                  <td className="px-5 py-3.5 text-gray-900 whitespace-nowrap">{clientNom}</td>
                  <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate">{d.objet || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{formatAr(d.sous_total)}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">{formatAr(d.total_ttc)}</td>
                  <td className={'px-5 py-3.5 font-medium whitespace-nowrap ' + statutColor}>
                    {statutLabel}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <a href={'/documents/' + d.id} className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <Pencil size={15} />
                      </a>
                      <button className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <Download size={15} />
                      </button>
                      <button
                        onClick={function () { handleDelete(d.id); }}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
