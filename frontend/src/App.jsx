import React, { useState, useEffect } from 'react';
import { useQuiz } from './QuizContext';
import TerminalHeader from './components/TerminalHeader';
import TermsPage from './pages/TermsPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  const { quizStarted, quizSubmitted, adminToken } = useQuiz();
  const [currentView, setView] = useState(() => {
    if (window.location.pathname.startsWith('/admin')) {
      return localStorage.getItem('adminToken') ? 'admin_dash' : 'admin_login';
    }
    const submitted = localStorage.getItem('quiz_result');
    if (submitted) return 'result';
    const started = localStorage.getItem('quiz_started') === 'true';
    return started ? 'quiz' : 'terms';
  });

  // Sync route view if quiz submitted or admin logged in
  useEffect(() => {
    if (quizSubmitted) {
      setView('result');
    }
  }, [quizSubmitted]);

  return (
    <div className="terminal-app-container">
      {/* Top Terminal Navigation Bar */}
      <TerminalHeader currentView={currentView} setView={setView} />

      {/* Main View Router */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentView === 'terms' && <TermsPage setView={setView} />}
        {currentView === 'quiz' && <QuizPage setView={setView} />}
        {currentView === 'result' && <ResultPage setView={setView} />}
        {currentView === 'admin_login' && <AdminLoginPage setView={setView} />}
        {currentView === 'admin_dash' && (
          adminToken ? <AdminDashboardPage setView={setView} /> : <AdminLoginPage setView={setView} />
        )}
      </main>

      {/* Terminal Status Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: 'var(--text-muted)',
          background: '#070a10',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>MCA 2026 EVALUATION SYSTEM</span>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <span style={{ color: 'var(--neon-green)' }}>● MONGO_DB CONNECTED</span>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <span style={{ color: 'var(--neon-cyan)' }}>NODE/EXPRESS CORE :5000</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span>UTF-8 // CRLF</span>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <span>TTY: 80x24</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
