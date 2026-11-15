import React, { useState } from 'react';
import { CareProvider } from './context/CareContext';
import { useCare } from './context/useCare';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { ElderHome } from './components/ElderHome';
import { TodayMedicines } from './components/TodayMedicines';
import { CareDashboard } from './components/CareDashboard';
import { MedicationsList } from './components/MedicationsList';
import { AdherenceInsights } from './components/AdherenceInsights';
import { AppointmentsView } from './components/AppointmentsView';
import { CareCircleView } from './components/CareCircleView';
import { MyPrivacyDashboard } from './components/MyPrivacyDashboard';
import { ActivityTimeline } from './components/ActivityTimeline';
import { CareNotesTasks } from './components/CareNotesTasks';
import { DoctorVisitSummaryModal } from './components/DoctorVisitSummaryModal';
import { EmergencyCardModal } from './components/EmergencyCardModal';
import { EmailSimulatorModal } from './components/EmailSimulatorModal';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { AddEditMedicationModal } from './components/AddEditMedicationModal';
import { MedicationDetailModal } from './components/MedicationDetailModal';
import { ToastContainer } from './components/ToastContainer';
import { LandingPage } from './components/LandingPage';
import { Medication } from './types';
import { RotateCcw } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isElderMode, resetAllData } = useCare();

  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isEmergencyCardOpen, setIsEmergencyCardOpen] = useState(false);
  const [isDoctorSummaryOpen, setIsDoctorSummaryOpen] = useState(false);
  const [isEmailSimulatorOpen, setIsEmailSimulatorOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onStartOnboarding={() => {
            setIsOnboardingOpen(true);
            setViewMode('app');
          }}
          onEnterInvite={() => {
            setViewMode('app');
            setActiveTab('circle');
          }}
          onEnterApp={() => setViewMode('app')}
        />

        <OnboardingWizardModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
        />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-200">
      {/* Skip to Content for Accessibility (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-xl focus:shadow-xl focus:font-bold"
      >
        Skip to main healthcare content
      </a>
      
      {/* Top Header */}
      <Header
        onOpenEmergencyCard={() => setIsEmergencyCardOpen(true)}
        onOpenDoctorSummary={() => setIsDoctorSummaryOpen(true)}
        onOpenEmailSimulator={() => setIsEmailSimulatorOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onGoToLanding={() => setViewMode('landing')}
      />

      {/* Main Tab Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main View Router */}
      <main id="main-content" tabIndex={-1} className="flex-1 pb-16 outline-none">
        {isElderMode ? (
          // ELDER MODE SCREENS
          activeTab === 'appointments' ? (
            <AppointmentsView />
          ) : activeTab === 'circle' ? (
            <CareCircleView />
          ) : activeTab === 'today' ? (
            <TodayMedicines />
          ) : (
            <ElderHome
              onNavigateToMeds={() => setActiveTab('today')}
              onNavigateToAppointments={() => setActiveTab('appointments')}
            />
          )
        ) : (
          // STANDARD / CARETAKER / FAMILY MODE SCREENS
          <>
            {activeTab === 'home' && (
              <CareDashboard
                onNavigateToMeds={() => setActiveTab('today')}
                onNavigateToAppointments={() => setActiveTab('appointments')}
                onNavigateToTasks={() => setActiveTab('notes')}
                onNavigateToCircle={() => setActiveTab('circle')}
                onOpenAddMedModal={() => setIsAddMedModalOpen(true)}
              />
            )}

            {activeTab === 'today' && <TodayMedicines />}

            {activeTab === 'medications' && (
              <MedicationsList
                onOpenAddModal={() => setIsAddMedModalOpen(true)}
                onSelectMedication={(med) => setSelectedMedication(med)}
              />
            )}

            {activeTab === 'insights' && (
              <AdherenceInsights
                onOpenDoctorSummary={() => setIsDoctorSummaryOpen(true)}
              />
            )}

            {activeTab === 'appointments' && <AppointmentsView />}

            {activeTab === 'circle' && <CareCircleView />}

            {activeTab === 'notes' && <CareNotesTasks />}

            {activeTab === 'privacy' && <MyPrivacyDashboard />}

            {activeTab === 'activity' && <ActivityTimeline />}
          </>
        )}
      </main>

      {/* Modals & Overlays */}
      <DoctorVisitSummaryModal
        isOpen={isDoctorSummaryOpen}
        onClose={() => setIsDoctorSummaryOpen(false)}
      />

      <EmergencyCardModal
        isOpen={isEmergencyCardOpen}
        onClose={() => setIsEmergencyCardOpen(false)}
      />

      <EmailSimulatorModal
        isOpen={isEmailSimulatorOpen}
        onClose={() => setIsEmailSimulatorOpen(false)}
      />

      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <AddEditMedicationModal
        isOpen={isAddMedModalOpen}
        onClose={() => setIsAddMedModalOpen(false)}
      />

      <MedicationDetailModal
        medication={selectedMedication}
        onClose={() => setSelectedMedication(null)}
      />

      {/* Toast Notifications with 8-second Undo */}
      <ToastContainer />

      {/* Bottom Footer Info */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-8 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-800">CareCircle Platform</span>
            <span>• Elder Care & Medication Management • Compliant with DPDP & WCAG 2.2 AA</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-slate-600 hover:text-emerald-700 font-semibold"
            >
              Onboarding Wizard
            </button>
            <span>•</span>
            <button
              onClick={resetAllData}
              className="text-slate-600 hover:text-rose-700 font-semibold flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <CareProvider>
      <MainAppContent />
    </CareProvider>
  );
}
