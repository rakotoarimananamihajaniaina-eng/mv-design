'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Search, Pencil, Download, Trash2 } from 'lucide-react';

function formatAr(n) {
  var num = Number(n || 0);
  return 'Ar ' + num.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
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
  accepte: 'Accepte',
  refuse: 'Refuse',
  impayee: 'Impayee',
  payee: 'Payee',
  partielle: 'Partielle',
};

var TABS = ['tous', 'devis', 'facture'];

function computeFiltered(docs, typeFilter, search) {
  var result = [];
  var q = search.toLowerCase();
  var i;
  for (i = 0; i < docs.length; i = i + 1) {
    var d = docs[i];
    var matchesType = false;
    if (typeFilter === 'tous') {
      matchesType = true;
    } else if (d.type === typeFilter) {
      matchesType = true;
    }
    var clientNom = '';
    if (d.clients && d.clients.nom) {
      clientNom = d.clients.nom;
    }
    var haystack = d.reference + ' ' + clientNom + ' ' + (d.objet || '');
    var matchesSearch = haystack.toLowerCase().indexOf(q) !== -1;
    if (matchesType === true) {
      if (matchesSearch === true) {
        result.push(d);
      }
    }
  }
  return result;
}

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

  function loadDocuments() {
    setLoading(true);
    var query = supabase
      .from('documents')
      .select('id, type, reference, date, objet, sous_total, total_ttc, statut, clients(nom)')
      .order('created_at', { ascending: false });
    query.then(function (result) {
      if (result.error === null && result.data) {
        setDocs(result.data);
      }
      setLoading(false);
    });
  }

  useEffect(function () {
    loadDocuments();
  }, []);

  function handleDelete(id) {
    var ok = window.confirm('Supprimer ce document ?');
    if (ok === false) {
      return;
    }
    var query = supabase.from('documents').delete().eq('id', id);
    query.then(function (result) {
      if (result.error === null) {
        var next = [];
        var i;
        for (i = 0; i < docs.length; i = i + 1) {
          if (docs[i].id !== id) {
            next.push(docs[i]);
          }
        }
        setDocs(next);
      }
    });
  }

  var filtered = computeFiltered(docs, typeFilter, search);

  var content = null;
  if (loading === true) {
    content = (
      <tr>
        <td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">
          Chargement...
        </td>
      </tr>
    );
  } else if (filtered.length === 0) {
    content = (
      <tr>
        <td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">
          Aucun document pour l'instant.
        </td>
      </tr>
    );
  } else {
    content = filtered.map(function (d) {
      var clientNom = '-';
      if (d.clients && d.clients.nom) {
        clientNom = d.clients.nom;
      }
      var typeStyle = TYPE_STYLES[d.type];
      if (!typeStyle) {
        typeStyle = 'bg-gray-50 text-gray-600';
      }
      var statutColor = STATUT_COLORS[d.statut];
      if (!statutColor) {
        statutColor = 'text-gray-500';
      }
      var statutLabel = STATUT_LABELS[d.statut];
      if (!statutLabel) {
        statutLabel = d.statut;
      }
      var typeLabel = 'Facture';
      if (d.type === 'devis') {
        typeLabel = 'Devis';
      }
      var objetLabel = d.objet;
      if (!objetLabel) {
        objetLabel = '-';
      }
      return (
        <tr key={d.id} className="hover:bg-gray-50">
          <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">{d.reference}</td>
          <td className="px-5 py-3.5 whitespace-nowrap">
            <span className={'px-2.5 py-1 rounded-full text-xs font-medium ' + typeStyle}>{typeLabel}</span>
          </td>
          <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{d.date}</td>
          <td className="px-5 py-3.5 text-gray-900 whitespace-nowrap">{clientNom}</td>
          <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate">{objetLabel}</td>
          <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{formatAr(d.sous_total)}</td>
          <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">{formatAr(d.total_ttc)}</td>
          <td className={'px-5 py-3.5 font-medium whitespace-nowrap ' + statutColor}>{statutLabel}</td>
          <td className="px-5 py-3.5">
            <div className="flex items-center justify-end gap-1">
              <a href={'/documents/' + d.id} className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                <Pencil size={15} />
              </a>
              <button className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                <Download size={15} />
              </button>
              <button onClick={function () { handleDelete(d.id); }} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50">
                <Trash2 size={15} />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  }

  var tabButtons = TABS.map(function (t) {
    var label = 'Factures';
    if (t === 'tous') {
      label = 'Tous';
    } else if (t === 'devis') {
      label = 'Devis';
    }
    var isActive = typeFilter === t;
    var tabClass = 'pb-3 text-sm font-medium border-b-2 -mb-px transition-colors border-transparent text-gray-500 hover:text-gray-700';
    if (isActive === true) {
      tabClass = 'pb-3 text-sm font-medium border-b-2 -mb-px transition-colors border-blue-600 text-blue-600';
    }
    return (
      <button key={t}
