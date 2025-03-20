
import React, { useState } from 'react';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { useSchedule } from '@/context/ScheduleContext';
import { TaskForm } from '@/components/schedule/TaskForm';
import { PendingFilesSummary } from '@/components/repository/PendingFilesSummary';
import { RepositoryActions } from '@/components/repository/RepositoryActions';
import { FileContent } from '@/components/repository/FileContent';
import { ScheduleContent } from '@/components/repository/ScheduleContent';

// Mock project data with pending files count
const projectsWithPendingFiles = [
  { id: '1', name: 'Cedar Heights Fiber', pendingCount: 25, billingCodes: ['FBR-001'] },
  { id: '2', name: 'Oakridge Expansion', pendingCount: 12, billingCodes: ['UND-025'] },
  { id: '3', name: 'Downtown Connection', pendingCount: 0, billingCodes: ['PMT-103'] },
  { id: '4', name: 'Westside Network', pendingCount: 8, billingCodes: ['SPL-072'] },
];

const RepositoryPage = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'schedule'>('all');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const { tasks } = useSchedule();

  // Total pending files across all projects
  const totalPendingFiles = projectsWithPendingFiles.reduce((sum, project) => sum + project.pendingCount, 0);

  // Toggle between files and schedule views
  const toggleScheduleView = () => {
    setShowSchedule(!showSchedule);
    if (!showSchedule) {
      setSelectedTab('schedule');
    } else {
      setSelectedTab('all');
    }
  };

  return (
    <SimplePageLayout 
      title="Field Repository & Schedule" 
      subtitle="Upload and manage project files, schedule tasks and monitor field operations"
    >
      <RepositoryActions 
        showSchedule={showSchedule}
        toggleScheduleView={toggleScheduleView}
        setShowUploader={setShowUploader}
        setIsTaskFormOpen={setIsTaskFormOpen}
        tasksCount={tasks.length}
        showUploader={showUploader}
      />

      {showSchedule ? (
        <ScheduleContent />
      ) : (
        <>
          {/* Project summary with pending files */}
          {totalPendingFiles > 0 && (
            <PendingFilesSummary 
              projects={projectsWithPendingFiles} 
              onSelectPending={() => setSelectedTab('pending')} 
            />
          )}

          <FileContent 
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            showUploader={showUploader}
            setShowUploader={setShowUploader}
            totalPendingFiles={totalPendingFiles}
          />
        </>
      )}
      
      <TaskForm open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen} />
    </SimplePageLayout>
  );
};

export default RepositoryPage;
