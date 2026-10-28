import React from 'react';
import { LogOut } from 'lucide-react';
import { StudentProfile } from '../types/placement';
import { AuthSession } from './LoginGateway';

interface NavbarProps {
  session: AuthSession;
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentStudent: StudentProfile;
  unreadCount: number;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  activeTab,
  onTabChange,
  currentStudent,
  unreadCount,
  onSignOut,
}) => {
  const isOfficer = session.role === 'officer';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-Zone Top Bar Contract */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={e => {
              e.preventDefault();
              onTabChange(isOfficer ? 'officer' : 'feed');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            CampusPlace
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          {isOfficer ? (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <button
                type="button"
                onClick={() => onTabChange('officer')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                  activeTab === 'officer' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
                }`}
              >
                Admin Console
              </button>
              <button
                type="button"
                onClick={() => onTabChange('pipeline')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                  activeTab === 'pipeline' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
                }`}
              >
                Candidate Pipeline
              </button>
              <button
                type="button"
                onClick={() => onTabChange('feed')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                  activeTab === 'feed' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
                }`}
              >
                Published Drives
              </button>
              <button
                type="button"
                onClick={() => onTabChange('eligibility')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                  activeTab === 'eligibility' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
                }`}
              >
                Cutoff Simulator
              </button>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <button
                type="button"
                onClick={() => onTabChange('feed')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                  activeTab === 'feed' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
                }`}
              >
                Drives &amp; Notices
              </button>
              <button
                type="button"
                onClick={() => onTabChange('eligibility')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                  activeTab === 'eligibility' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
                }`}
              >
                Eligibility Engine
              </button>
              <button
                type="button"
                onClick={() => onTabChange('pipeline')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                  activeTab === 'pipeline' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
                }`}
              >
                My Pipeline
              </button>
              <button
                type="button"
                onClick={() => onTabChange('reminders')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                  activeTab === 'reminders' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
                }`}
              >
                Reminders ({unreadCount})
              </button>
            </nav>
          )}

          {/* Zone 3: 1 primary action (Sign Out) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onSignOut}
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out ({isOfficer ? 'Admin' : currentStudent.name.split(' ')[0]})</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100 overflow-x-auto text-xs gap-3">
          {isOfficer ? (
            <>
              <button
                type="button"
                onClick={() => onTabChange('officer')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'officer' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Admin Console
              </button>
              <button
                type="button"
                onClick={() => onTabChange('pipeline')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'pipeline' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Pipeline
              </button>
              <button
                type="button"
                onClick={() => onTabChange('feed')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'feed' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Drives
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onTabChange('feed')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'feed' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Drives
              </button>
              <button
                type="button"
                onClick={() => onTabChange('eligibility')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'eligibility' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Eligibility
              </button>
              <button
                type="button"
                onClick={() => onTabChange('pipeline')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'pipeline' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Pipeline
              </button>
              <button
                type="button"
                onClick={() => onTabChange('reminders')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'reminders' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Reminders ({unreadCount})
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
