import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Download,
  Eye,
  EyeOff,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Search,
  Building2,
  Mail,
  Phone,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CompanyDrive, ApplicationRecord, PlacementSource } from '../types/placement';
import { maskEmail, maskPhone, maskUSN } from '../utils/privacy';
import { downloadPlacementCSV } from '../utils/csvExport';

interface TPOManagerProps {
  drives: CompanyDrive[];
  applications: ApplicationRecord[];
  onAddNewDrive: (drive: CompanyDrive) => void;
  onAdvanceStage: (applicationId: string, nextNotes?: string) => void;
  onRejectApplication: (applicationId: string) => void;
  onAwardOffer: (applicationId: string, ctc: string) => void;
}

export const TPOManager: React.FC<TPOManagerProps> = ({
  drives,
  applications,
  onAddNewDrive,
  onAdvanceStage,
  onRejectApplication,
  onAwardOffer,
}) => {
  const [maskPII, setMaskPII] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Form state for new drive
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formCTC, setFormCTC] = useState('');
  const [formLocation, setFormLocation] = useState('Bengaluru');
  const [formDeadline, setFormDeadline] = useState('2026-11-20');
  const [formDriveDate, setFormDriveDate] = useState('2026-11-25');
  const [formMinCGPA, setFormMinCGPA] = useState('7.0');
  const [formBranches, setFormBranches] = useState<string[]>(['CSE', 'ISE', 'ECE']);
  const [formMaxBacklogs, setFormMaxBacklogs] = useState('0');
  const [formSource, setFormSource] = useState<PlacementSource>('College Portal');
  const [formDescription, setFormDescription] = useState('');
  const [formRounds, setFormRounds] = useState('Online Assessment, Technical Interview, HR Interview');

  const availableBranches = ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'Civil', 'Chemical'];

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formRole || !formCTC) return;

    const newDrive: CompanyDrive = {
      id: `drv-${formCompany.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`,
      companyName: formCompany,
      role: formRole,
      packageCTC: formCTC.includes('LPA') ? formCTC : `${formCTC} LPA`,
      numericCTC: parseFloat(formCTC) || 10.0,
      location: formLocation,
      deadlineDate: formDeadline,
      driveDate: formDriveDate,
      minCGPA: parseFloat(formMinCGPA) || 6.0,
      eligibleBranches: formBranches.length > 0 ? formBranches : ['All'],
      maxBacklogs: parseInt(formMaxBacklogs, 10) || 0,
      description: formDescription || `Recruitment drive for ${formRole} at ${formCompany}.`,
      rounds: formRounds.split(',').map(r => r.trim()).filter(Boolean),
      source: formSource,
      contactEmail: `tpo-desk@${formCompany.toLowerCase().replace(/\s+/g, '')}.com`,
      status: 'Active',
      tags: ['New Drive', 'Verified TPO'],
    };

    onAddNewDrive(newDrive);
    setShowAddModal(false);

    // Reset
    setFormCompany('');
    setFormRole('');
    setFormCTC('');
    setFormDescription('');
  };

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const matchCompany = selectedCompanyFilter === 'All' || app.companyName === selectedCompanyFilter;
    const matchStatus = selectedStatusFilter === 'All' || app.overallStatus === selectedStatusFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchSearch =
      app.studentName.toLowerCase().includes(searchLower) ||
      app.studentUSN.toLowerCase().includes(searchLower) ||
      app.companyName.toLowerCase().includes(searchLower) ||
      app.studentBranch.toLowerCase().includes(searchLower);

    return matchCompany && matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Control Zone */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-100 text-indigo-700">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Training &amp; Placement Officer (TPO) Console
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Maintain verified applicant records, advance selection rounds, protect student data privacy, and broadcast company drives.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Privacy Toggle */}
          <button
            type="button"
            onClick={() => setMaskPII(!maskPII)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
              maskPII
                ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            title="Mask emails, phone numbers, and USNs for public display or projection"
          >
            {maskPII ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span>{maskPII ? 'PII Masking Active (Noticeboard Mode)' : 'Protect Student Privacy'}</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={() => downloadPlacementCSV(applications, maskPII)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Roster CSV</span>
          </button>

          {/* Post New Drive */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Drive</span>
          </button>
        </div>
      </div>

      {/* Roster Controls: Search & Filters */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate USN, name, company..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Company & Status Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span>Company:</span>
            <select
              value={selectedCompanyFilter}
              onChange={e => setSelectedCompanyFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800"
            >
              <option value="All">All Companies</option>
              {Array.from(new Set(applications.map(a => a.companyName))).map(comp => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <span>Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800"
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Applications Master Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">
            Verified Student Applications &amp; Selection Progress Roster
          </h2>
          <span className="text-xs font-mono-numbers text-slate-500">
            Showing {filteredApps.length} of {applications.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                <th className="py-3 px-4">Candidate USN &amp; Name</th>
                <th className="py-3 px-4">Branch &amp; CGPA</th>
                <th className="py-3 px-4">Company &amp; Role</th>
                <th className="py-3 px-4">Current Selection Round</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Overall Status</th>
                <th className="py-3 px-4 text-right">TPO Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No candidate records found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => {
                  const activeStage = app.stages[app.currentStageIndex];
                  const displayName = maskPII
                    ? `${app.studentName.split(' ')[0]} [Protected]`
                    : app.studentName;
                  const displayUSN = maskPII ? maskUSN(app.studentUSN) : app.studentUSN;
                  const displayEmail = maskPII ? maskEmail(app.studentEmail) : app.studentEmail;
                  const displayPhone = maskPII ? maskPhone(app.studentPhone) : app.studentPhone;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* USN & Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{displayName}</div>
                        <div className="text-[11px] font-mono-numbers text-slate-500">{displayUSN}</div>
                      </td>

                      {/* Branch & CGPA */}
                      <td className="py-3.5 px-4 font-mono-numbers">
                        <span className="font-medium text-slate-800">{app.studentBranch}</span>
                        <div className="text-[11px] text-slate-500">
                          CGPA: <strong>{app.studentCGPA.toFixed(2)}</strong> · {app.studentBacklogs} Backlogs
                        </div>
                      </td>

                      {/* Company & Role */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{app.companyName}</div>
                        <div className="text-[11px] text-indigo-700 font-semibold font-mono-numbers">
                          {app.packageCTC}
                        </div>
                      </td>

                      {/* Current Round */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 truncate max-w-[160px]">
                          {activeStage?.stageName || 'Application Review'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Round {app.currentStageIndex + 1} of {app.stages.length}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 font-mono-numbers text-[11px] text-slate-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[130px]">{displayEmail}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-slate-500">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{displayPhone}</span>
                        </div>
                      </td>

                      {/* Overall Status */}
                      <td className="py-3.5 px-4">
                        {app.overallStatus === 'Offered' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            <Award className="w-3.5 h-3.5" />
                            Offer Released
                          </span>
                        ) : app.overallStatus === 'Rejected' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                            <XCircle className="w-3.5 h-3.5" />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                            <Clock className="w-3.5 h-3.5" />
                            In Progress
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {app.overallStatus === 'In Progress' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onAdvanceStage(app.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors whitespace-nowrap shadow-2xs"
                              title="Advance student to next interview round"
                            >
                              Advance
                            </button>
                            <button
                              type="button"
                              onClick={() => onAwardOffer(app.id, app.packageCTC)}
                              className="px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                              title="Issue placement offer"
                            >
                              Offer
                            </button>
                            <button
                              type="button"
                              onClick={() => onRejectApplication(app.id)}
                              className="px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Mark rejected"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Record Closed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post New Drive Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Post New Company Placement Drive</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon AWS"
                    value={formCompany}
                    onChange={e => setFormCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Job Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Solutions Architect"
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Package (CTC in LPA) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 21.0 LPA"
                    value={formCTC}
                    onChange={e => setFormCTC(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Minimum CGPA Cutoff</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5.0"
                    max="10.0"
                    value={formMinCGPA}
                    onChange={e => setFormMinCGPA(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={formMaxBacklogs}
                    onChange={e => setFormMaxBacklogs(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={e => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Notice Origin Channel</label>
                  <select
                    value={formSource}
                    onChange={e => setFormSource(e.target.value as PlacementSource)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="College Portal">College Portal</option>
                    <option value="Email Notice">Email Notice</option>
                    <option value="TPO WhatsApp">TPO WhatsApp</option>
                    <option value="Official Bulletin">Official Bulletin</option>
                  </select>
                </div>
              </div>

              {/* Eligible Branches */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Eligible Engineering Branches
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableBranches.map(branch => {
                    const isChecked = formBranches.includes(branch);
                    return (
                      <button
                        key={branch}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setFormBranches(formBranches.filter(b => b !== branch));
                          } else {
                            setFormBranches([...formBranches, branch]);
                          }
                        }}
                        className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                          isChecked
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {branch}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selection Process Rounds */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Recruitment Pipeline Rounds (Comma separated)
                </label>
                <input
                  type="text"
                  value={formRounds}
                  onChange={e => setFormRounds(e.target.value)}
                  placeholder="e.g. Online Test, Technical Round 1, System Design, HR"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Job Description &amp; Requirements</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Brief overview of role responsibilities, tech stack, and eligibility notes..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Publish Placement Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
