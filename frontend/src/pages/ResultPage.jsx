import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Shield, User, Clock, ArrowRight, Lock, FileCheck } from 'lucide-react';
import { useQuiz } from '../QuizContext';

const ResultPage = ({ setView }) => {
  const { quizResult, candidate, resetQuiz } = useQuiz();

  useEffect(() => {
    // Subtle terminal celebratory confetti burst on successful submission
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#00ff66', '#00f0ff', '#39ff14']
    });
  }, []);

  const handleReturnHome = () => {
    resetQuiz();
    setView('terms');
  };

  const candidateName = candidate?.name || quizResult?.studentName || 'Candidate';
  const candidateId = candidate?.studentId || quizResult?.studentId || 'MCA-2026';
  const submissionTime = quizResult?.submittedAt
    ? new Date(quizResult.submittedAt).toLocaleString()
    : new Date().toLocaleString();

  const timeSpentSeconds = quizResult?.timeSpentSeconds || 0;
  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;

  return (
    <div className="terminal-window fade-in" style={{ maxWidth: '850px', margin: '30px auto' }}>
      {/* Titlebar */}
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-title">
          <span>status://</span>
          <span className="active-term">submission_ack.log</span>
        </div>
        <div className="terminal-meta">
          <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>● SECURELY_LOGGED</span>
        </div>
      </div>

      <div className="terminal-body" style={{ padding: '36px 32px' }}>
        {/* Terminal Header Prompt */}
        <div className="prompt-line" style={{ marginBottom: '24px' }}>
          <span className="user-host">candidate@mca</span>
          <span>:</span>
          <span className="dir">~/exam</span>
          <span>$</span>
          <span className="cmd">./submit_evaluation.sh --confirm</span>
        </div>

        {/* Central Success Banner */}
        <div
          style={{
            textAlign: 'center',
            padding: '36px 24px',
            background: 'linear-gradient(180deg, rgba(0, 255, 102, 0.08) 0%, rgba(5, 10, 20, 0.4) 100%)',
            border: '1px solid rgba(0, 255, 102, 0.3)',
            borderRadius: '8px',
            marginBottom: '28px',
            boxShadow: '0 0 25px rgba(0, 255, 102, 0.1)'
          }}
        >
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(0, 255, 102, 0.12)', marginBottom: '16px' }}>
            <CheckCircle2 size={48} color="var(--neon-green)" />
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--neon-green)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}
          >
            Successfully submitted the quiz
          </h1>

          <p style={{ color: 'var(--text-main)', fontSize: '14px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            Your assessment responses have been securely verified, encrypted, and written to the central database.
          </p>
        </div>

        {/* Candidate & Verification Meta Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '28px'
          }}
        >
          <div style={{ background: '#080b12', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
              <User size={13} color="var(--neon-cyan)" />
              <span>Candidate Name</span>
            </div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px', marginTop: '4px' }}>
              {candidateName}
            </div>
            <div style={{ color: 'var(--neon-cyan)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              ID: {candidateId}
            </div>
          </div>

          <div style={{ background: '#080b12', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
              <Clock size={13} color="var(--neon-amber)" />
              <span>Submission Time</span>
            </div>
            <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '13px', marginTop: '4px' }}>
              {submissionTime}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>
              Duration: {minutes}m {seconds}s
            </div>
          </div>

          <div style={{ background: '#080b12', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
              <FileCheck size={13} color="var(--neon-green)" />
              <span>Verification Receipt</span>
            </div>
            <div style={{ color: 'var(--neon-green)', fontWeight: 700, fontSize: '13px', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              REC-{quizResult?.attemptId ? String(quizResult.attemptId).slice(-8).toUpperCase() : 'AUTH-OK'}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>
              Status: ARCHIVED_IN_DB
            </div>
          </div>
        </div>

        {/* Administrative Confidentiality Notice */}
        <div
          style={{
            background: 'rgba(0, 240, 255, 0.04)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: '6px',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}
        >
          <Lock size={20} color="var(--neon-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ color: 'var(--neon-cyan)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
              Evaluation Privacy & Security Protocol
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
              In accordance with examination guidelines, scoring metrics, percentage accuracy, and individual answer sheets are confidential and accessible exclusively by authorized faculty via the <strong>Admin Portal</strong>. Results will not be shown to candidates directly on this terminal.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px'
          }}
        >
          <button
            type="button"
            className="btn-term btn-primary"
            onClick={handleReturnHome}
            style={{ padding: '10px 22px', fontSize: '13px' }}
          >
            <span>Return to Main Console</span>
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            className="btn-term btn-secondary"
            onClick={() => setView('admin_login')}
            style={{ padding: '10px 18px', fontSize: '12px' }}
          >
            <Shield size={14} />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
