import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  History,
  Search,
  Download,
  ShieldCheck,
  Clock,
  Pill,
  Key,
  Calendar,
  Lock,
} from 'lucide-react';

export const ActivityTimeline: React.FC = () => {
  const { auditLogs } = useCare();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');

  const filteredLogs = auditLogs
    .filter((l) => (selectedEntity === 'all' ? true : l.entity === selectedEntity))
    .filter(
      (l) =>
        l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.action.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleExportLogs = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Actor,Role,Action,Entity,Details']
        .concat(
          auditLogs.map(
            (l) =>
              `"${l.timestamp}","${l.actorName}","${l.actorRole}","${l.action}","${l.entity}","${l.details.replace(/"/g, '""')}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CareCircle_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'Dose':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'Medication':
        return <Pill className="w-4 h-4 text-blue-600" />;
      case 'Circle':
        return <Key className="w-4 h-4 text-amber-600" />;
      case 'Appointment':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'Privacy':
        return <Lock className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Activity Timeline
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Append-Only</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            An immutable, timestamped record of every medication dose, schedule edit, invite code, and circle change.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shrink-0 shadow-sm"
          title="Download complete audit log as CSV"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'Dose', 'Medication', 'Appointment', 'Circle', 'Privacy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedEntity(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedEntity === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Activity' : cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity records..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6">
          {filteredLogs.map((log) => {
            const dateObj = new Date(log.timestamp);
            return (
              <div key={log.id} className="relative group">
                {/* Node icon on timeline stem */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-8 h-8 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-sm">
                  {getEntityIcon(log.entity)}
                </div>

                {/* Event Card */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 hover:border-slate-300 transition-colors space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900">{log.actorName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                        {log.actorRole.replace('_', ' ')}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-600">{log.action}</span>
                    </div>

                    <span className="font-mono text-slate-400">
                      {dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                      {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-800 pt-1 leading-relaxed">
                    {log.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <History className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm">No activity log entries match your filter.</p>
          </div>
        )}
      </div>

    </div>
  );
};

