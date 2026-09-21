import React from 'react';
import { Terminal, Shield, User, LogOut } from 'lucide-react';
import { useQuiz } from '../QuizContext';

const TerminalHeader = ({ currentView, setView }) => {
  const { adminToken, logoutAdmin, candidate, quizStarted, quizSubmitted } = useQuiz();

  return (
    <header className="terminal-navbar">
      <div className="brand-logo" onClick={() => setView('terms')}>
        <span className="term-sym">&gt;_</span>
        <span>MCA_CONSOLE</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>
          [v2.6.0]
        </span>
      </div>

      <div className="nav-links">
        {candidate.name && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--neon-green)', background: 'rgba(0, 255, 102, 0.08)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(0, 255, 102, 0.2)' }}>
            <User size={13} />
            <span>{candidate.name} ({candidate.studentId})</span>
          </div>
        )}

        {adminToken ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className={`btn-term ${currentView === 'admin_dash' ? 'btn-cyan' : 'btn-secondary'}`}
              onClick={() => setView('admin_dash')}
            >
              <Shield size={14} />
              <span>Admin Console</span>
            </button>
            <button
              className="btn-term btn-danger"
              onClick={() => {
                logoutAdmin();
                setView('terms');
              }}
              title="Logout Administrator"
            >
              <LogOut size={14} />
              <span>Exit Root</span>
            </button>
          </div>
        ) : (
          <button
            className={`btn-term ${currentView === 'admin_login' ? 'btn-cyan' : 'btn-secondary'}`}
            onClick={() => setView('admin_login')}
          >
            <Shield size={14} />
            <span>Admin Portal</span>
          </button>
        )}

        <div className="badge-status">
          ACTIVE
        </div>
      </div>
    </header>
  );
};

export default TerminalHeader;
