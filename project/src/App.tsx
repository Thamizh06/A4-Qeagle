import React, { useState } from 'react';
import { UserProfile, UpskillPlan } from './types';
import { generateUpskillPlan } from './services/planGenerator';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [upskillPlan, setUpskillPlan] = useState<UpskillPlan | null>(null);

  const handleGeneratePlan = (profile: UserProfile) => {
    setUserProfile(profile);
    const plan = generateUpskillPlan(profile);
    setUpskillPlan(plan);
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setUserProfile(null);
    setUpskillPlan(null);
  };

  return (
    <div className="min-h-screen">
      {currentView === 'landing' ? (
        <LandingPage onGeneratePlan={handleGeneratePlan} />
      ) : (
        userProfile && upskillPlan && (
          <Dashboard
            plan={upskillPlan}
            profile={userProfile}
            onBack={handleBackToLanding}
          />
        )
      )}
    </div>
  );
}

export default App;