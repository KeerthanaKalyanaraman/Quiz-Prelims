import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Send, AlertTriangle, HelpCircle } from 'lucide-react';
import { useQuiz } from '../QuizContext';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import QuestionMatrix from '../components/QuestionMatrix';

const QuizPage = ({ setView }) => {
  const {
    questions,
    currentIndex,
    nextQuestion,
    prevQuestion,
    answers,
    candidate,
    submitQuiz,
    loading,
    error
  } = useQuiz();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const answeredCount = questions.filter(
    (q) => answers[q._id] !== undefined && answers[q._id] !== -1
  ).length;
  const unansweredCount = questions.length - answeredCount;

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    await submitQuiz();
    setView('result');
  };

  return (
    <div className="terminal-window fade-in" style={{ maxWidth: '1280px' }}>
      {/* Title Bar */}
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-title">
          <span>exam_session://</span>
          <span className="active-term">{candidate.studentId || 'session-active'}</span>
        </div>
        <div className="terminal-meta">
          <Timer />
        </div>
      </div>

      <div className="terminal-body" style={{ padding: '20px' }}>
        {error && (
          <div
            style={{
              background: 'rgba(255, 51, 102, 0.15)',
              border: '1px solid var(--neon-red)',
              color: 'var(--neon-red)',
              padding: '10px 14px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '13px'
            }}
          >
            [SYSTEM-ALERT] {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '20px' }}>
          {/* Main Question Column */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <QuestionCard />

            {/* Navigation & Action Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className={`btn-term btn-secondary ${currentIndex === 0 ? 'btn-disabled' : ''}`}
                  onClick={prevQuestion}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={16} />
                  <span>PREV</span>
                </button>

                <button
                  type="button"
                  className={`btn-term btn-secondary ${currentIndex === questions.length - 1 ? 'btn-disabled' : ''}`}
                  onClick={nextQuestion}
                  disabled={currentIndex === questions.length - 1}
                >
                  <span>NEXT</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="btn-term btn-primary"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={loading}
                >
                  <Send size={15} />
                  <span>SUBMIT QUIZ ({answeredCount}/{questions.length || 25})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Column: Matrix & Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Student Info Card */}
            <div
              style={{
                background: '#070a10',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '14px',
                fontSize: '12px'
              }}
            >
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Candidate Profile
              </div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px' }}>{candidate.name}</div>
              <div style={{ color: 'var(--neon-green)', fontFamily: 'var(--font-mono)' }}>{candidate.studentId}</div>
            </div>

            {/* Interactive Question Matrix */}
            <QuestionMatrix />

            {/* Terminal Tips */}
            <div
              style={{
                background: 'rgba(0, 240, 255, 0.04)',
                border: '1px solid rgba(0, 240, 255, 0.15)',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '11px',
                color: 'var(--text-muted)',
                lineHeight: 1.5
              }}
            >
              <div style={{ color: 'var(--neon-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <HelpCircle size={13} />
                <span>TERMINAL SHORTCUTS</span>
              </div>
              <div>• Click any number 1-{questions.length || 25} in the matrix to jump directly.</div>
              <div>• Use Flag to mark questions you wish to review later.</div>
              <div>• Auto-save ensures your selections persist.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="terminal-titlebar">
              <div className="terminal-dots">
                <span className="dot dot-red" onClick={() => setShowConfirmModal(false)} style={{ cursor: 'pointer' }} />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="terminal-title">
                <span>prompt://</span>
                <span className="active-term">confirm_submission.sh</span>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--neon-amber)', marginBottom: '14px' }}>
                <AlertTriangle size={24} />
                <h3 style={{ fontSize: '16px', color: '#ffffff', fontWeight: 700 }}>Finalize & Score Quiz?</h3>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '16px', lineHeight: 1.5 }}>
                You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length || 25}</strong> questions.
                {unansweredCount > 0 && (
                  <span style={{ display: 'block', color: 'var(--neon-amber)', marginTop: '6px' }}>
                    Notice: {unansweredCount} question(s) will be submitted as skipped (0 marks).
                  </span>
                )}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-term btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Return to Quiz
                </button>
                <button
                  type="button"
                  className="btn-term btn-primary"
                  onClick={handleFinalSubmit}
                  disabled={loading}
                >
                  {loading ? 'Submitting & Scoring...' : 'Confirm Final Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
