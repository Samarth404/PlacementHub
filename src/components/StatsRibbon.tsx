import React from 'react';
import { Briefcase, Award, TrendingUp, CheckCircle, Users, Clock } from 'lucide-react';
import { CompanyDrive, StudentProfile, ApplicationRecord } from '../types/placement';
import { evaluateEligibility } from '../utils/eligibility';

interface StatsRibbonProps {
  drives: CompanyDrive[];
  student: StudentProfile;
  applications: ApplicationRecord[];
  role: 'student' | 'officer';
  onNavigateToTab?: (tab: string) => void;
}

export const StatsRibbon: React.FC<StatsRibbonProps> = ({
  drives,
  student,
  applications,
  role,
  onNavigateToTab,
}) => {
  const activeDrives = drives.filter(d => d.status === 'Active');
  
  // Drives student qualifies for
  const eligibleDrives = activeDrives.filter(d => evaluateEligibility(student, d).isEligible);
  
  // Student applications
  const studentApps = applications.filter(a => a.studentId === student.id);
  const activeInterviews = studentApps.filter(a => a.overallStatus === 'In Progress').length;
  const offersReceived = studentApps.filter(a => a.overallStatus === 'Offered').length;

  // Global metrics for TPO
  const totalOffers = applications.filter(a => a.overallStatus === 'Offered').length;
  const highestPackage = Math.max(...drives.map(d => d.numericCTC || 0), 0);
  const averagePackage = (drives.reduce((acc, d) => acc + (d.numericCTC || 0), 0) / (drives.length || 1)).toFixed(1);

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Metric 1 */}
          <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              <span>Active Drives</span>
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono-numbers">
              {activeDrives.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Across all tiers
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{role === 'student' ? 'You Qualify For' : 'Student Eligibility'}</span>
            </div>
            <div className="text-xl font-bold text-emerald-700 font-mono-numbers">
              {eligibleDrives.length} <span className="text-xs font-normal text-slate-500">/ {activeDrives.length}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Based on {student.cgpa.toFixed(2)} CGPA
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>Highest CTC</span>
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono-numbers">
              {highestPackage.toFixed(1)} <span className="text-xs font-medium text-slate-500">LPA</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Google India (L3)
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>Average CTC</span>
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono-numbers">
              {averagePackage} <span className="text-xs font-medium text-slate-500">LPA</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Campus pool average
            </div>
          </div>

          {/* Metric 5 */}
          <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{role === 'student' ? 'In Active Rounds' : 'Active Interviews'}</span>
            </div>
            <div className="text-xl font-bold text-amber-700 font-mono-numbers">
              {role === 'student' ? activeInterviews : applications.filter(a => a.overallStatus === 'In Progress').length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Tests & Interviews
            </div>
          </div>

          {/* Metric 6 */}
          <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>{role === 'student' ? 'Offers Awarded' : 'Total Offers Rolled'}</span>
            </div>
            <div className="text-xl font-bold text-emerald-700 font-mono-numbers">
              {role === 'student' ? offersReceived : totalOffers}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {role === 'student' && offersReceived > 0 ? 'Cisco Systems (19.5 LPA)' : 'Verified selections'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
