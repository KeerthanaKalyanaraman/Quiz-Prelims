import React, { useState } from 'react';
import { Terminal, ShieldCheck, CheckSquare, Square, Play, AlertCircle, Cpu } from 'lucide-react';
import { useQuiz } from '../QuizContext';

const TermsPage = ({ setView }) => {
  const { candidate, questions, resetQuiz, startCandidateQuiz } = useQuiz();
  const [name, setName] = useState(candidate.name || '');
  const [studentId, setStudentId] = useState(candidate.studentId || '');
  const [accepted, setAccepted] = useState(candidate.acceptedTerms || false);
  const [validationError, setValidationError] = useState('');

  const handleStart = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please input candidate full name.');
      return;
    }
    if (!studentId.trim()) {
      setValidationError('Please input candidate registration ID / roll number.');
      return;
    }
    if (!accepted) {
      setValidationError('You must accept the terms of examination before proceeding.');
      return;
    }

    startCandidateQuiz({
      name: name.trim(),
      studentId: studentId.trim(),
      acceptedTerms: true
    });
    setView('quiz');
  };

  return (
    <div className="terminal-window fade-in">
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-title">
          <span>bash -</span>
          <span className="active-term">candidate_registration.sh</span>
        </div>
        <div className="terminal-meta">
          <span>HOST: 127.0.0.1</span>
        </div>
      </div>

      <div className="terminal-body">
        {/* Terminal Header Greeting */}
        <div className="prompt-line">
          <span className="user-host">candidate@mca-eval</span>
          <span>:</span>
          <span className="dir">~/exam-portal</span>
          <span>$</span>
          <span className="cmd">./init_examination_protocol.sh</span>
          <span className="cursor-blink"></span>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', color: '#ffffff', fontWeight: 800, marginBottom: '6px', letterSpacing: '0.5px' }}>
            Technical quiz
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Standardized 25-Question Technical Assessment across C, C++, Python, Java, OOP & SQL.
          </p>
        </div>

        {validationError && (
          <div
            style={{
              background: 'rgba(255, 51, 102, 0.1)',
              border: '1px solid var(--neon-red)',
              color: 'var(--neon-red)',
              padding: '12px 16px',
              borderRadius: '4px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px'
            }}
          >
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Instructions Box */}
          <div
            style={{
              background: '#090d16',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-cyan)', marginBottom: '14px', fontSize: '14px', fontWeight: 700 }}>
              <Cpu size={16} />
              <span>TEST SPECIFICATIONS & RULES</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-main)' }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--neon-green)' }}>[✓]</span>
                <span><strong>Total Questions:</strong> 25 Multiple Choice Questions</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--neon-green)' }}>[✓]</span>
                <span><strong>Subject Domains:</strong> C, C++, Python, Java, OOP & SQL</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--neon-green)' }}>[✓]</span>
                <span><strong>Duration Limit:</strong> 20 Minutes countdown timer</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--neon-green)' }}>[✓]</span>
                <span><strong>Marking Scheme:</strong> +1 mark for correct, 0 for incorrect or unanswered</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--neon-green)' }}>[✓]</span>
                <span><strong>Anti-Cheat Verification:</strong> Answer keys are sealed and verified strictly on the backend server upon submission.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--neon-green)' }}>[✓]</span>
                <span><strong>Review Protocol:</strong> Immediate terminal scorecard and comprehensive answer explanations are generated after completion.</span>
              </li>
            </ul>
          </div>

          {/* Registration Form */}
          <form
            onSubmit={handleStart}
            style={{
              background: '#090d16',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-green)', marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>
              <ShieldCheck size={16} />
              <span>CANDIDATE AUTHENTICATION</span>
            </div>

            <div className="term-input-group">
              <label className="term-label">Candidate Full Name *</label>
              <input
                type="text"
                className="term-input"
                placeholder="e.g. Keerthana R"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="term-input-group">
              <label className="term-label">Enter your Team no *</label>
              <input
                type="text"
                className="term-input"
                placeholder="e.g. MCA2026-042"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>

            {/* Terms Checkbox */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginTop: '16px',
                marginBottom: '20px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
              onClick={() => setAccepted(!accepted)}
            >
              <div style={{ marginTop: '2px', color: accepted ? 'var(--neon-green)' : 'var(--text-muted)' }}>
                {accepted ? <CheckSquare size={18} /> : <Square size={18} />}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                I certify that I am the authorized candidate, agree to the examination protocol, and will not use unauthorized materials.
              </span>
            </div>

            <button
              type="submit"
              className="btn-term btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px' }}
            >
              <Play size={16} />
              <span>START 25-QUESTION QUIZ</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
