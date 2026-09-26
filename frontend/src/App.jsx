import { useState, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { HomeView } from './views/HomeView.jsx';
import { AuthView } from './views/AuthView.jsx';
import { WarRoomView } from './views/WarRoomView.jsx';
import { DealFlowView } from './views/DealFlowView.jsx';
import { DossiersView } from './views/DossiersView.jsx';
import { CompareView } from './views/CompareView.jsx';
import { ProfileView } from './views/ProfileView.jsx';
import { useCaseSocket } from './hooks/useCaseSocket.js';
import { useAuth } from './context/AuthContext.jsx';
import { useTheme } from './context/ThemeContext.jsx';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { isAuthenticated, isLoading, token } = useAuth();
  useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [caseId, setCaseId] = useState(null);
  const [currentCaseIdea, setCurrentCaseIdea] = useState('');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Completed analyses stored for DealFlow pipeline with localStorage persistence
  const [completedCases, setCompletedCases] = useState(() => {
    try {
      const saved = localStorage.getItem('pitchvane_completed_cases');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pitchvane_completed_cases', JSON.stringify(completedCases));
    } catch (e) {
      console.error('Failed to save completed cases', e);
    }
  }, [completedCases]);

  const {
    isConnected,
    agentStates,
    debatePoints,
    verdict,
    fullCaseData,
    error: socketError,
    resetState,
  } = useCaseSocket(caseId);

  // When a verdict arrives, register this case in the deal pipeline
  const [registeredCaseIds, setRegisteredCaseIds] = useState(new Set());

  // Add completed case to deal pipeline when verdict is ready
  if (verdict && currentCaseIdea && caseId && !registeredCaseIds.has(caseId)) {
    const score = verdict?.score ?? 8.0;
    const scoreNum = parseFloat(score).toFixed(1);
    // Parse company name from idea
    const firstLine = currentCaseIdea.split('\n')[0].trim();
    const companyName = firstLine.length > 3 && firstLine.length < 60 ? firstLine : currentCaseIdea.slice(0, 40).trim();

    const newCase = {
      id: caseId,
      name: companyName,
      stage: 'Seed / Series A',
      sector: 'Technology & AI',
      score: scoreNum,
      raise: '$2.5M',
      syndicate: 'PitchVane AI Research',
      summary: currentCaseIdea.slice(0, 150).trim() + (currentCaseIdea.length > 150 ? '...' : ''),
      consensus: `${Object.values(agentStates).filter((a) => a.status === 'done').length}/4 Agents Validated`,
      status: verdict?.recommendation?.includes('Pass') ? 'Passed' : 'Active Diligence',
      badgeColor: verdict?.recommendation?.includes('Pass')
        ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/40'
        : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40',
      // Full analysis data for dossier
      verdict,
      debatePoints,
      agentStates,
      idea: currentCaseIdea,
      fullCaseData,
    };

    setCompletedCases((prev) => [newCase, ...prev.filter((c) => c.id !== caseId)]);
    setRegisteredCaseIds((prev) => new Set([...prev, caseId]));
    setSelectedDeal(newCase);
  }

  const handleTabChange = (tabId) => {
    if (tabId === 'home' || tabId === 'auth') {
      setActiveTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!isAuthenticated) {
      setActiveTab('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAnalysis = async (idea, files = []) => {
    setLoading(true);
    setFetchError(null);
    setCurrentCaseIdea(idea);
    resetState();

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('http://localhost:5000/api/cases', {
        method: 'POST',
        headers,
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) throw new Error(`Server returned error: ${response.statusText}`);
      const data = await response.json();
      setCaseId(data.caseId);
    } catch (err) {
      console.error('Failed to initiate case:', err);
      setFetchError(err.message || 'Could not connect to backend server at http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  // Select a deal and open its full dossier
  const handleSelectDeal = (deal) => {
    setSelectedDeal(deal);
    setActiveTab('dossiers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // After analysis completes, allow "View in Deal Flow" navigation
  const handleViewInDealFlow = () => {
    setActiveTab('dealflow');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#030712] flex flex-col items-center justify-center text-slate-700 dark:text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-cyan-400 mb-4" />
        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] dark:bg-[#030712] text-[#090d16] dark:text-slate-100 font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-indigo-600 dark:selection:bg-cyan-500 selection:text-white dark:selection:text-black relative overflow-x-hidden transition-colors duration-200">
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isConnected={isConnected}
      />

      {activeTab === 'home' && (
        <main className="relative z-10 flex-grow w-full">
          <HomeView
            onEnterWarRoom={() => handleTabChange('warroom')}
            onExploreDossiers={() => handleTabChange('dossiers')}
            onOpenAuth={() => handleTabChange('auth')}
          />
        </main>
      )}

      {activeTab !== 'home' && (
        <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {activeTab === 'auth' && (
            <AuthView
              initialMode="signin"
              onSuccess={() => {
                setActiveTab('warroom');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'warroom' && (
            <WarRoomView
              onStartAnalysis={handleStartAnalysis}
              loading={loading}
              fetchError={fetchError}
              socketError={socketError}
              agentStates={agentStates}
              verdict={verdict}
              debatePoints={debatePoints}
              currentCaseIdea={currentCaseIdea}
              fullCaseData={fullCaseData}
              isConnected={isConnected}
              onViewInDealFlow={handleViewInDealFlow}
            />
          )}

          {activeTab === 'dealflow' && (
            <DealFlowView
              onSelectDeal={handleSelectDeal}
              completedCases={completedCases}
              onStartNew={() => handleTabChange('warroom')}
              onGoToCompare={() => handleTabChange('compare')}
            />
          )}

          {activeTab === 'dossiers' && (
            <DossiersView
              selectedDeal={selectedDeal}
              completedCases={completedCases}
              onSelectDeal={setSelectedDeal}
              currentAnalysis={verdict && currentCaseIdea ? {
                id: caseId || 'current',
                name: currentCaseIdea.split('\n')[0].slice(0, 35),
                sector: 'Technology & AI',
                stage: 'Seed / Series A',
                raise: '$2.5M',
                score: verdict?.score ? Number(verdict.score).toFixed(1) : '8.0',
                verdict,
                debatePoints,
                agentStates,
                idea: currentCaseIdea,
                fullCaseData,
              } : null}
              onGoToDealFlow={() => handleTabChange('dealflow')}
              onGoToCompare={() => handleTabChange('compare')}
              onStartNew={() => handleTabChange('warroom')}
            />
          )}

          {activeTab === 'compare' && (
            <CompareView
              completedCases={completedCases}
              onSelectForDossier={(deal) => {
                setSelectedDeal(deal);
                setActiveTab('dossiers');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartNew={() => handleTabChange('warroom')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView onNavigate={handleTabChange} />
          )}
        </main>
      )}

      <AuthModal />
      {(activeTab === 'home' || activeTab === 'profile') && (
        <Footer onNavigate={handleTabChange} />
      )}
    </div>
  );
}
