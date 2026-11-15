import React, { useState } from 'react';
import { useCare } from '../context/useCare';
import {
  MessageSquare,
  CheckSquare,
  ClipboardList,
  Plus,
  UserCheck,
  Check,
  X,
} from 'lucide-react';
import { CareNote } from '../types';

export const CareNotesTasks: React.FC = () => {
  const {
    careNotes,
    careTasks,
    shiftHandoffs,
    currentMember,
    addCareNote,
    addCareTask,
    claimTask,
    completeTask,
    addShiftHandoff,
  } = useCare();

  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'tasks' | 'handoff'>('notes');

  // New Note Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<CareNote['category']>('vital');

  // New Task Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  // Shift Handoff Modal
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);
  const [shiftType, setShiftType] = useState<'morning' | 'evening' | 'night'>('morning');
  const [shiftNotes, setShiftNotes] = useState('');
  const [vitalsSummary, setVitalsSummary] = useState('BP: 128/82 mmHg | Blood Sugar: 110 mg/dL');
  const [medsSummary, setMedsSummary] = useState('Morning doses completed on schedule.');

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    addCareNote(noteContent.trim(), noteCategory);
    setNoteContent('');
    setIsNoteModalOpen(false);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addCareTask(taskTitle.trim(), taskDueDate || new Date().toISOString().split('T')[0], taskDesc);
    setTaskTitle('');
    setTaskDesc('');
    setIsTaskModalOpen(false);
  };

  const handleSaveHandoff = (e: React.FormEvent) => {
    e.preventDefault();
    addShiftHandoff({
      caretakerName: currentMember.name,
      shiftDate: new Date().toISOString().split('T')[0],
      shiftType,
      notes: shiftNotes,
      vitalsSummary,
      medsGivenSummary: medsSummary,
    });
    setShiftNotes('');
    setIsHandoffModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Collaboration, Notes & Tasks
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Shared health observations, actionable circle to-dos, and caregiver shift handoffs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeSubTab === 'notes' && (
            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Care Note</span>
            </button>
          )}

          {activeSubTab === 'tasks' && (
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          )}

          {activeSubTab === 'handoff' && (
            <button
              onClick={() => setIsHandoffModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Log Shift Handoff</span>
            </button>
          )}
        </div>
      </div>

      {/* Segmented Controls */}
      <div className="flex items-center space-x-1 p-1 rounded-2xl bg-slate-100 border border-slate-200 w-fit">
        <button
          onClick={() => setActiveSubTab('notes')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'notes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>Care Notes ({careNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'tasks' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-amber-600" />
          <span>Care Tasks ({careTasks.filter((t) => t.status !== 'completed').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('handoff')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'handoff' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardList className="w-4 h-4 text-indigo-600" />
          <span>Shift Handoffs ({shiftHandoffs.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: Care Notes (PRD COL-2) */}
      {activeSubTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careNotes.map((note) => {
            const dateObj = new Date(note.date);
            return (
              <div
                key={note.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900">{note.authorName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      {note.authorRole.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="text-slate-400">
                    {dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                    {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {note.content}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold uppercase text-[10px]">
                    🏷️ {note.category}
                  </span>
                  {note.isPrivateToElder && (
                    <span className="text-[11px] text-slate-400 italic">
                      Private to elder & primary caretaker
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 2: Care Tasks (PRD COL-3) */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-3">
          {careTasks.map((task) => {
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl p-5 border-2 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted ? 'border-slate-200 bg-slate-50 opacity-70' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <button
                    onClick={() => completeTask(task.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-emerald-500'
                    }`}
                  >
                    {isCompleted && <Check className="w-4 h-4" />}
                  </button>

                  <div>
                    <h4 className={`text-base font-extrabold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      Due: <strong className="text-slate-700">{task.dueDate}</strong> • Created by {task.createdBy}
                    </p>
                  </div>
                </div>

                {/* Assignment & Claim Action */}
                <div className="flex items-center space-x-3 self-end sm:self-center">
                  {task.assignedTo ? (
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>{task.assignedTo}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => claimTask(task.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold transition-colors"
                    >
                      Claim Task
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 3: Shift Handoffs (PRD COL-4) */}
      {activeSubTab === 'handoff' && (
        <div className="space-y-4">
          {shiftHandoffs.map((sh) => (
            <div
              key={sh.id}
              className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      {sh.caretakerName} • {sh.shiftType.toUpperCase()} Shift
                    </h4>
                    <p className="text-xs text-slate-400">Date: {sh.shiftDate}</p>
                  </div>
                </div>

                <span className="text-xs font-bold bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full border border-indigo-200">
                  Handoff Completed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-700 uppercase tracking-wide">Vitals Recorded:</span>
                  <p className="text-slate-900 font-semibold">{sh.vitalsSummary}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-700 uppercase tracking-wide">Medications Given:</span>
                  <p className="text-slate-900 font-semibold">{sh.medsGivenSummary}</p>
                </div>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-950 block mb-1">Shift Notes & Observations:</span>
                <p>{sh.notes}</p>
              </div>

              {sh.concerns && (
                <div className="text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <strong>Notes for next caretaker:</strong> {sh.concerns}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Add Care Note</h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Category
                </label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="vital">Vitals (BP, Sugar, Pulse)</option>
                  <option value="symptom">Symptoms & Pain Levels</option>
                  <option value="mood">Mood & Appetite</option>
                  <option value="doctor_visit">Doctor Recommendation</option>
                  <option value="general">General Family Observation</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Note Details *
                </label>
                <textarea
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="e.g. Morning BP was 128/82. Savitri enjoyed a full bowl of porridge..."
                  rows={4}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
                >
                  Post Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Create Care Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Buy Glimepiride refill from Apollo"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Description
                </label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Additional instructions..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Shift Handoff Modal */}
      {isHandoffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Log Caretaker Shift Handoff</h3>
              <button onClick={() => setIsHandoffModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHandoff} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Shift Period
                </label>
                <select
                  value={shiftType}
                  onChange={(e) => setShiftType(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="morning">Morning Shift (07:00 - 15:00)</option>
                  <option value="evening">Evening Shift (15:00 - 22:00)</option>
                  <option value="night">Night Shift (22:00 - 07:00)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Vitals Summary
                </label>
                <input
                  type="text"
                  value={vitalsSummary}
                  onChange={(e) => setVitalsSummary(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Doses Administered Summary
                </label>
                <input
                  type="text"
                  value={medsSummary}
                  onChange={(e) => setMedsSummary(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Detailed Notes & Handoff Instructions *
                </label>
                <textarea
                  required
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  placeholder="e.g. Assisted with knee hot compress. Dr. Kulkarni summary printed. Savitri is in good spirits..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsHandoffModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md"
                >
                  Complete Shift Handoff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

