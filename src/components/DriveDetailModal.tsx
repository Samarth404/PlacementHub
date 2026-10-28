import React from 'react';
import {
  X,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Mail,
  Bell,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CompanyDrive, StudentProfile, ApplicationRecord } from '../types/placement';
import { evaluateEligibility } from '../utils/eligibility';

interface DriveDetailModalProps {
  drive: CompanyDrive | null;
  student: StudentProfile;
  applications: ApplicationRecord[];
  onClose: () => void;
  onApply: (drive: CompanyDrive) => void;
  onAddReminder: (drive: CompanyDrive) => void;
}

export const DriveDetailModal: React.FC<DriveDetailModalProps> = ({
  drive,
  student,
  applications,
  onClose,
  onApply,
  onAddReminder,
}) => {
  if (!drive) return null;

  const evalResult = evaluateEligibility(student, drive);
  const studentApp = applications.find(a => a.driveId === drive.id && a.studentId === student.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-indigo-600">{drive.source}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {drive.location}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{drive.companyName}</h2>
            <p className="text-sm font-medium text-slate-700">{drive.role}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Package & Key Dates Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Package (CTC)</span>
              <span className="text-base font-bold text-indigo-700 font-mono-numbers">
                {drive.packageCTC}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Min CGPA</span>
              <span className="text-base font-bold text-slate-800 font-mono-numbers">
                ≥ {drive.minCGPA.toFixed(2)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Application Deadline</span>
              <span className="text-xs font-semibold text-slate-800 font-mono-numbers">
                {drive.deadlineDate}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Campus Drive Date</span>
              <span className="text-xs font-semibold text-slate-800 font-mono-numbers">
                {drive.driveDate}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Role &amp; Opportunity Overview
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {drive.description}
            </p>
          </div>

          {/* Automated Eligibility Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Automated Eligibility Breakdown
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5">
              {evalResult.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/50 last:border-0">
                  <div className="flex items-center gap-2">
                    {item.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-medium text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono-numbers">
                    <span className="text-slate-400 text-[11px]">Req: {item.required}</span>
                    <span className={`font-semibold ${item.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                      Your: {item.actual}
                    </span>
                  </div>
                </div>
              ))}

              <div className="pt-2 text-xs flex items-center justify-between font-medium">
                <span className="text-slate-600">Overall Match Verdict:</span>
                {evalResult.isEligible ? (
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded">
                    Qualified to Apply
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold bg-rose-100 px-2.5 py-0.5 rounded">
                    Does Not Meet Criteria
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Recruitment Rounds Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Selection Rounds Plan ({drive.rounds.length} Rounds)
            </h3>
            <div className="space-y-2">
              {drive.rounds.map((round, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                    {idx + 1}
                  </div>
                  <div className="font-medium text-slate-800">{round}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Registration Link */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-900">
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Campus Point of Contact: <strong>{drive.contactEmail}</strong></span>
            </div>
            {drive.registrationLink && (
              <a
                href={drive.registrationLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-semibold text-indigo-700 hover:text-indigo-900 shrink-0"
              >
                <span>External Portal Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onAddReminder(drive)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-slate-500" />
            <span>Set Reminder</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Close
            </button>
            {studentApp ? (
              <span className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-lg">
                Already Applied
              </span>
            ) : evalResult.isEligible ? (
              <button
                type="button"
                onClick={() => {
                  onApply(drive);
                  onClose();
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Submit Application
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="px-4 py-2 text-xs font-medium text-slate-400 bg-slate-200 rounded-lg cursor-not-allowed"
              >
                Ineligible to Apply
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
