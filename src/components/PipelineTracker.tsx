import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Video,
  FileCheck,
  Award,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { ApplicationRecord, StudentProfile, ApplicationStage } from '../types/placement';

interface PipelineTrackerProps {
  applications: ApplicationRecord[];
  student: StudentProfile;
  role: 'student' | 'officer';
  onAdvanceStage: (applicationId: string, nextNotes?: string) => void;
  onRejectApplication: (applicationId: string) => void;
  onAwardOffer: (applicationId: string, ctc: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
  applications,
  student,
  role,
  onAdvanceStage,
  onRejectApplication,
  onAwardOffer,
  onNavigateToTab,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Student applications if in student view, or all if in officer view
  const displayApps = (role === 'student'
    ? applications.filter(a => a.studentId === student.id)
    : applications
  ).filter(app => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'In Progress') return app.overallStatus === 'In Progress';
    if (filterStatus === 'Offered') return app.overallStatus === 'Offered';
    if (filterStatus === 'Rejected') return app.overallStatus === 'Rejected';
    return true;
  });

  const selectedApp = displayApps.find(a => a.id === selectedAppId) || displayApps[0];

  const getStageBadge = (status: ApplicationStage['status']) => {
    switch (status) {
      case 'Cleared':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            <CheckCircle className="w-3.5 h-3.5" />
            Cleared
          </span>
        );
      case 'In Progress':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Current Round
          </span>
        );
      case 'Offer Issued':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            <Award className="w-3.5 h-3.5" />
            Offer Released
          </span>
        );
      case 'Not Cleared':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            Not Cleared
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            Upcoming
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Selection Process Pipeline Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track multi-round interview progression, schedule times, meeting links, and offer rollout status.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200 shadow-xs">
          {['All', 'In Progress', 'Offered', 'Rejected'].map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {displayApps.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No applications in pipeline</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You have not applied for any company drives yet. Browse open drives and apply now.
          </p>
          <button
            type="button"
            onClick={() => onNavigateToTab('feed')}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Explore Open Drives
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Applications List (Cards) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Active Drives In Pipeline ({displayApps.length})
            </h2>

            {displayApps.map(app => {
              const isSelected = selectedApp?.id === app.id;
              const activeStage = app.stages[app.currentStageIndex];
              const progressPercentage = Math.round(
                ((app.currentStageIndex + (app.overallStatus === 'Offered' ? 1 : 0)) / app.stages.length) * 100
              );

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{app.companyName}</h3>
                      <p className="text-xs text-slate-600">{app.role}</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-700 font-mono-numbers">
                      {app.packageCTC}
                    </span>
                  </div>

                  {/* Stage indicator */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Stage {app.currentStageIndex + 1} of {app.stages.length}:
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                      {activeStage?.stageName || 'Application'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-300 ${
                        app.overallStatus === 'Offered'
                          ? 'bg-emerald-500'
                          : app.overallStatus === 'Rejected'
                          ? 'bg-rose-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 font-mono-numbers">
                    <span>Applied: {app.appliedDate}</span>
                    <span
                      className={`font-semibold ${
                        app.overallStatus === 'Offered'
                          ? 'text-emerald-700'
                          : app.overallStatus === 'Rejected'
                          ? 'text-rose-700'
                          : 'text-indigo-600'
                      }`}
                    >
                      {app.overallStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Stage Stepper & Execution Panel */}
          {selectedApp && (
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{selectedApp.companyName}</h2>
                    {selectedApp.overallStatus === 'Offered' && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        Offer Accepted ({selectedApp.offerCTC || selectedApp.packageCTC})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {selectedApp.role} · Candidate: <strong>{selectedApp.studentName}</strong> ({selectedApp.studentUSN})
                  </p>
                </div>

                {/* Officer Stage Progression Action */}
                {role === 'officer' && selectedApp.overallStatus === 'In Progress' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onAdvanceStage(selectedApp.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span>Advance Round</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onAwardOffer(selectedApp.id, selectedApp.packageCTC)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      Issue Offer
                    </button>
                    <button
                      type="button"
                      onClick={() => onRejectApplication(selectedApp.id)}
                      className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Stage Step Timeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recruitment Round Trajectory
                </h3>

                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 before:z-0">
                  {selectedApp.stages.map((stage, idx) => {
                    const isCurrent = idx === selectedApp.currentStageIndex && selectedApp.overallStatus === 'In Progress';
                    const isPassed = idx < selectedApp.currentStageIndex || selectedApp.overallStatus === 'Offered';

                    return (
                      <div key={idx} className="relative z-10 flex items-start gap-4">
                        {/* Step Marker */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                            isPassed
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {isPassed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>

                        {/* Step Content Card */}
                        <div
                          className={`flex-1 p-4 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-indigo-50/40 border-indigo-200 shadow-xs'
                              : isPassed
                              ? 'bg-white border-slate-200'
                              : 'bg-slate-50/50 border-slate-100 opacity-75'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">
                                {stage.stageName}
                              </h4>
                              {stage.scheduledDate && (
                                <p className="text-xs font-mono-numbers text-slate-500 mt-0.5 flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{stage.scheduledDate} {stage.scheduledTime ? `at ${stage.scheduledTime}` : ''}</span>
                                </p>
                              )}
                            </div>
                            <div>{getStageBadge(stage.status)}</div>
                          </div>

                          {/* Meeting Link or Preparation Details */}
                          {stage.meetingLink && (
                            <div className="mt-3 p-2.5 rounded-lg bg-white border border-indigo-100 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2 text-indigo-700 font-medium truncate">
                                <Video className="w-4 h-4 shrink-0" />
                                <span className="truncate">Interview Room: {stage.meetingLink}</span>
                              </div>
                              <a
                                href={stage.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors flex items-center gap-1 shrink-0"
                              >
                                <span>Join</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}

                          {/* Notes / Feedback */}
                          {stage.notes && (
                            <p className="text-xs text-slate-600 mt-2 bg-white/60 p-2 rounded border border-slate-100">
                              <span className="font-semibold text-slate-700">Preparation Focus: </span>
                              {stage.notes}
                            </p>
                          )}

                          {stage.scoreOrFeedback && (
                            <p className="text-xs text-emerald-800 mt-2 bg-emerald-50/60 p-2 rounded border border-emerald-100">
                              <span className="font-semibold">Evaluator Notes: </span>
                              {stage.scoreOrFeedback}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
