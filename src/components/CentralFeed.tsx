import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Building2,
  Mail,
  Globe,
  MessageSquare,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bell,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { CompanyDrive, StudentProfile, ApplicationRecord, NoticeItem, PlacementSource } from '../types/placement';
import { evaluateEligibility } from '../utils/eligibility';

interface CentralFeedProps {
  drives: CompanyDrive[];
  student: StudentProfile;
  applications: ApplicationRecord[];
  notices: NoticeItem[];
  onApplyDrive: (drive: CompanyDrive) => void;
  onAddReminder: (drive: CompanyDrive) => void;
  onOpenDetails: (drive: CompanyDrive) => void;
  onNavigateToTab: (tab: string) => void;
}

export const CentralFeed: React.FC<CentralFeedProps> = ({
  drives,
  student,
  applications,
  notices,
  onApplyDrive,
  onAddReminder,
  onOpenDetails,
  onNavigateToTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [eligibleOnly, setEligibleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'deadline' | 'ctc_desc' | 'cgpa_asc'>('deadline');
  const [dismissedNoticeIds, setDismissedNoticeIds] = useState<string[]>([]);

  // Filter urgent notices
  const activeUrgentNotices = notices.filter(n => n.urgent && !dismissedNoticeIds.includes(n.id));

  // Filter and sort drives
  const filteredDrives = drives
    .filter(drive => {
      // Search
      const searchLower = searchTerm.toLowerCase();
      const matchSearch =
        drive.companyName.toLowerCase().includes(searchLower) ||
        drive.role.toLowerCase().includes(searchLower) ||
        drive.tags.some(t => t.toLowerCase().includes(searchLower)) ||
        drive.eligibleBranches.some(b => b.toLowerCase().includes(searchLower));

      // Source
      const matchSource = selectedSource === 'All' || drive.source === selectedSource;

      // Eligibility
      const evalResult = evaluateEligibility(student, drive);
      const matchEligibility = !eligibleOnly || evalResult.isEligible;

      return matchSearch && matchSource && matchEligibility;
    })
    .sort((a, b) => {
      if (sortBy === 'ctc_desc') return b.numericCTC - a.numericCTC;
      if (sortBy === 'cgpa_asc') return a.minCGPA - b.minCGPA;
      // Default: deadline soonest
      return new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime();
    });

  // Source icon helper
  const getSourceIcon = (source: PlacementSource) => {
    switch (source) {
      case 'Email Notice':
        return <Mail className="w-3.5 h-3.5 text-blue-600" />;
      case 'College Portal':
        return <Globe className="w-3.5 h-3.5 text-indigo-600" />;
      case 'TPO WhatsApp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Official Bulletin':
        return <FileText className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  // Helper to calculate days remaining
  const getDaysLeft = (dateStr: string) => {
    const today = new Date('2026-10-28');
    const deadline = new Date(dateStr);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Aggregated Urgent Notices Banner */}
      {activeUrgentNotices.length > 0 && (
        <div className="space-y-3">
          {activeUrgentNotices.map(notice => (
            <div
              key={notice.id}
              className="p-4 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-start justify-between gap-4 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold mb-0.5">
                    <span>{notice.title}</span>
                    <span className="text-amber-600/70">·</span>
                    <span className="text-amber-700 font-normal">Source: {notice.source}</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">{notice.content}</p>
                  {notice.deadline && (
                    <p className="text-[11px] font-mono-numbers text-amber-700 mt-1">
                      Action Deadline: {notice.deadline} ({getDaysLeft(notice.deadline)} days remaining)
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDismissedNoticeIds(prev => [...prev, notice.id])}
                className="text-xs font-medium text-amber-700 hover:text-amber-900 px-2 py-1 rounded hover:bg-amber-100/60 transition-colors shrink-0"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hero Welcome & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Central Placement Feed & Notices
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Scattered notices aggregated from placement emails, college portals, and TPO channels.
          </p>
        </div>

        {/* Quick Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company, skill, branch..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        {/* Source Segmented Selector */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-semibold text-slate-500 mr-2">Source:</span>
          {['All', 'College Portal', 'Email Notice', 'TPO WhatsApp', 'Official Bulletin'].map(src => (
            <button
              key={src}
              type="button"
              onClick={() => setSelectedSource(src)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedSource === src
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {src}
            </button>
          ))}
        </div>

        {/* Right side controls: Eligible Only & Sort */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={() => setEligibleOnly(!eligibleOnly)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              eligibleOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${eligibleOnly ? 'text-emerald-600' : 'text-slate-400'}`} />
            Eligible for Me Only ({student.branch} · {student.cgpa})
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="deadline">Closing Soonest</option>
              <option value="ctc_desc">Highest CTC</option>
              <option value="cgpa_asc">Lowest CGPA Cutoff</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drives Grid */}
      <div className="space-y-4">
        {filteredDrives.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No matching placement drives found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or toggling off the &quot;Eligible for Me Only&quot; filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedSource('All');
                setEligibleOnly(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredDrives.map(drive => {
            const evalResult = evaluateEligibility(student, drive);
            const daysLeft = getDaysLeft(drive.deadlineDate);
            const studentApp = applications.find(a => a.driveId === drive.id && a.studentId === student.id);

            return (
              <div
                key={drive.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Block: Company Info & Metadata */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        {getSourceIcon(drive.source)}
                        <span>{drive.source}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{drive.location}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 font-mono-numbers">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Drive Date: {drive.driveDate}</span>
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        {drive.companyName}
                        <span className="text-sm font-semibold text-indigo-700 font-mono-numbers">
                          {drive.packageCTC}
                        </span>
                      </h2>
                      <p className="text-sm font-medium text-slate-700 mt-0.5">{drive.role}</p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl leading-relaxed">
                      {drive.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                      <span className="font-medium text-slate-400">Branches:</span>
                      <span>{drive.eligibleBranches.join(', ')}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-400">Min CGPA:</span>
                      <span className="font-mono-numbers">{drive.minCGPA.toFixed(2)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-400">Max Backlogs:</span>
                      <span>{drive.maxBacklogs}</span>
                    </div>
                  </div>

                  {/* Right Block: Status, Eligibility & Actions */}
                  <div className="flex flex-col items-start lg:items-end justify-between gap-4 lg:w-72 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                    {/* Eligibility Indicator */}
                    <div className="w-full lg:text-right">
                      {evalResult.isEligible ? (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                          <div className="flex items-center lg:justify-end gap-1.5 font-bold text-emerald-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>100% Eligible to Apply</span>
                          </div>
                          <p className="text-[11px] text-emerald-700 mt-0.5">
                            You meet CGPA (≥{drive.minCGPA}) &amp; Branch requirements.
                          </p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs">
                          <div className="flex items-center lg:justify-end gap-1.5 font-bold text-rose-800">
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>Not Eligible</span>
                          </div>
                          <p className="text-[11px] text-rose-700 mt-0.5 line-clamp-2">
                            {evalResult.reasons[0] || 'Criteria does not match profile'}
                          </p>
                        </div>
                      )}

                      {/* Deadline Countdown */}
                      <p className="text-[11px] font-mono-numbers text-slate-500 mt-2">
                        {daysLeft > 0 ? (
                          <span className={daysLeft <= 3 ? 'text-amber-600 font-semibold' : ''}>
                            Deadline in {daysLeft} day{daysLeft === 1 ? '' : 's'} ({drive.deadlineDate})
                          </span>
                        ) : (
                          <span className="text-rose-600 font-semibold">Deadline Passed</span>
                        )}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                      <button
                        type="button"
                        onClick={() => onOpenDetails(drive)}
                        className="flex-1 lg:flex-none px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Drive Details
                      </button>

                      {studentApp ? (
                        <button
                          type="button"
                          onClick={() => onNavigateToTab('pipeline')}
                          className="flex-1 lg:flex-none px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <span>Track Stage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : evalResult.isEligible ? (
                        <button
                          type="button"
                          onClick={() => onApplyDrive(drive)}
                          className="flex-1 lg:flex-none px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Apply Now</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenDetails(drive)}
                          className="flex-1 lg:flex-none px-4 py-2 text-xs font-medium text-slate-500 bg-slate-100 rounded-lg cursor-not-allowed whitespace-nowrap"
                        >
                          Ineligible
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onAddReminder(drive)}
                        title="Add to reminders calendar"
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors shrink-0"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selection Process Flow preview */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Recruitment Rounds Pipeline:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {drive.rounds.map((round, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center"
                      >
                        <div className="text-[10px] font-mono-numbers font-bold text-slate-400">
                          ROUND {idx + 1}
                        </div>
                        <div className="text-xs font-medium text-slate-800 truncate mt-0.5" title={round}>
                          {round}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
