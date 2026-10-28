import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Sliders,
  Sparkles,
  HelpCircle,
  Building2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { CompanyDrive, StudentProfile, ApplicationRecord } from '../types/placement';
import { evaluateEligibility } from '../utils/eligibility';

interface EligibilityCheckerProps {
  drives: CompanyDrive[];
  student: StudentProfile;
  applications: ApplicationRecord[];
  onApplyDrive: (drive: CompanyDrive) => void;
  onUpdateStudentProfile: (updated: Partial<StudentProfile>) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  drives,
  student,
  applications,
  onApplyDrive,
  onUpdateStudentProfile,
}) => {
  // Simulator state
  const [testCGPA, setTestCGPA] = useState<number>(student.cgpa);
  const [testBranch, setTestBranch] = useState<string>(student.branch);
  const [testBacklogs, setTestBacklogs] = useState<number>(student.backlogs);
  const [simulationActive, setSimulationActive] = useState<boolean>(false);

  // Active profile to test against
  const activeTestProfile: StudentProfile = {
    ...student,
    cgpa: simulationActive ? testCGPA : student.cgpa,
    branch: simulationActive ? testBranch : student.branch,
    backlogs: simulationActive ? testBacklogs : student.backlogs,
  };

  const handleResetSimulation = () => {
    setTestCGPA(student.cgpa);
    setTestBranch(student.branch);
    setTestBacklogs(student.backlogs);
    setSimulationActive(false);
  };

  const branchesList = ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'Civil', 'Chemical', 'Biotech'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Explainer */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Automated Eligibility Verification Engine
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Eliminate uncertainty. The engine computes strict multi-parameter matching across CGPA thresholds, eligible engineering branches, and active backlog policies.
        </p>
      </div>

      {/* Simulator Control Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-semibold text-slate-900">
              {simulationActive ? 'Interactive Eligibility Simulator (What-If Mode)' : 'Current Academic Profile Parameters'}
            </h2>
          </div>
          {simulationActive ? (
            <button
              type="button"
              onClick={handleResetSimulation}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Actual Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSimulationActive(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              Simulate What-If Scenarios
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CGPA Slider / Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Cumulative GPA (CGPA)</label>
              <span className="text-sm font-bold text-indigo-600 font-mono-numbers">
                {activeTestProfile.cgpa.toFixed(2)} / 10.0
              </span>
            </div>
            <input
              type="range"
              min="5.0"
              max="10.0"
              step="0.05"
              value={activeTestProfile.cgpa}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setTestCGPA(val);
                setSimulationActive(true);
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Drag to see which tier of companies unlock as your CGPA shifts.
            </p>
          </div>

          {/* Branch Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Engineering Branch</label>
              <span className="text-xs font-bold text-slate-800">{activeTestProfile.branch}</span>
            </div>
            <select
              value={activeTestProfile.branch}
              onChange={e => {
                setTestBranch(e.target.value);
                setSimulationActive(true);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {branchesList.map(b => (
                <option key={b} value={b}>
                  {b} Engineering
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Check branch-specific openings (e.g. circuit branches vs core engineering).
            </p>
          </div>

          {/* Active Backlogs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Active Academic Backlogs</label>
              <span className="text-xs font-bold text-slate-800 font-mono-numbers">
                {activeTestProfile.backlogs}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    setTestBacklogs(count);
                    setSimulationActive(true);
                  }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    activeTestProfile.backlogs === count
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {count} {count === 3 ? '+' : ''}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Tier-1 product companies enforce a strict 0-backlog policy.
            </p>
          </div>
        </div>

        {simulationActive && (
          <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs text-indigo-800">
            <span>
              <strong>Note:</strong> You are testing hypothetical values.
            </span>
            <button
              type="button"
              onClick={() => {
                onUpdateStudentProfile({
                  cgpa: testCGPA,
                  branch: testBranch,
                  backlogs: testBacklogs,
                });
                setSimulationActive(false);
              }}
              className="px-3 py-1 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Save as Permanent Profile
            </button>
          </div>
        )}
      </div>

      {/* Comprehensive Company Audit Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">
            Eligibility Evaluation Matrix Across All Active Drives
          </h2>
          <span className="text-xs font-medium text-slate-500">
            {drives.filter(d => evaluateEligibility(activeTestProfile, d).isEligible).length} of {drives.length} Qualified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                <th className="py-3 px-4">Company &amp; Role</th>
                <th className="py-3 px-4">Package (CTC)</th>
                <th className="py-3 px-4">CGPA Cutoff</th>
                <th className="py-3 px-4">Eligible Branches</th>
                <th className="py-3 px-4">Max Backlogs</th>
                <th className="py-3 px-4 text-center">Eligibility Decision</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {drives.map(drive => {
                const evalResult = evaluateEligibility(activeTestProfile, drive);
                const hasApplied = applications.some(
                  a => a.driveId === drive.id && a.studentId === student.id
                );
                const cgpaDiff = (activeTestProfile.cgpa - drive.minCGPA).toFixed(2);

                return (
                  <tr key={drive.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Company */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{drive.companyName}</div>
                      <div className="text-[11px] text-slate-500">{drive.role}</div>
                    </td>

                    {/* CTC */}
                    <td className="py-3.5 px-4 font-mono-numbers font-semibold text-indigo-700">
                      {drive.packageCTC}
                    </td>

                    {/* CGPA */}
                    <td className="py-3.5 px-4 font-mono-numbers">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">≥ {drive.minCGPA.toFixed(2)}</span>
                        {evalResult.cgpaPass ? (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                            +{cgpaDiff}
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                            {cgpaDiff}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        (Your: {activeTestProfile.cgpa.toFixed(2)})
                      </span>
                    </td>

                    {/* Branches */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {evalResult.branchPass ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        )}
                        <span className={evalResult.branchPass ? 'text-slate-800' : 'text-rose-700 font-medium'}>
                          {drive.eligibleBranches.join(', ')}
                        </span>
                      </div>
                    </td>

                    {/* Backlogs */}
                    <td className="py-3.5 px-4 font-mono-numbers">
                      <div className="flex items-center gap-1.5">
                        {evalResult.backlogsPass ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        )}
                        <span>Max {drive.maxBacklogs}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        (Your: {activeTestProfile.backlogs})
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      {evalResult.isEligible ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Eligible
                        </span>
                      ) : (
                        <div className="inline-block text-left">
                          <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-1 rounded-md text-[11px]">
                            <XCircle className="w-3.5 h-3.5" />
                            Ineligible
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      {hasApplied ? (
                        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                          Applied
                        </span>
                      ) : evalResult.isEligible ? (
                        <button
                          type="button"
                          onClick={() => onApplyDrive(drive)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap"
                        >
                          Apply
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Ineligible</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
