import { ApplicationRecord } from '../types/placement';
import { maskEmail, maskPhone, maskUSN } from './privacy';

export function downloadPlacementCSV(records: ApplicationRecord[], maskPII: boolean = false, filenamePrefix: string = 'Campus_Placement_Roster'): void {
  const headers = [
    'Application ID',
    'Company',
    'Role',
    'Package CTC',
    'Student USN',
    'Student Name',
    'Branch',
    'CGPA',
    'Backlogs',
    'Email',
    'Phone',
    'Current Stage',
    'Overall Status',
    'Applied Date',
    'Last Updated',
  ];

  const rows = records.map(record => {
    const activeStage = record.stages[record.currentStageIndex]?.stageName || 'Applied';
    const email = maskPII ? maskEmail(record.studentEmail) : record.studentEmail;
    const phone = maskPII ? maskPhone(record.studentPhone) : record.studentPhone;
    const usn = maskPII ? maskUSN(record.studentUSN) : record.studentUSN;
    const name = maskPII ? `${record.studentName.split(' ')[0]} [Protected]` : record.studentName;

    return [
      `"${record.id}"`,
      `"${record.companyName.replace(/"/g, '""')}"`,
      `"${record.role.replace(/"/g, '""')}"`,
      `"${record.packageCTC}"`,
      `"${usn}"`,
      `"${name.replace(/"/g, '""')}"`,
      `"${record.studentBranch}"`,
      record.studentCGPA.toFixed(2),
      record.studentBacklogs,
      `"${email}"`,
      `"${phone}"`,
      `"${activeStage.replace(/"/g, '""')}"`,
      `"${record.overallStatus}"`,
      `"${record.appliedDate}"`,
      `"${record.lastUpdated}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  const privacySuffix = maskPII ? '_Masked_Noticeboard' : '_Admin_Complete';
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${dateStr}${privacySuffix}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
