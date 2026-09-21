import React, { useState, useEffect } from 'react';
import { Database, ListChecks, Plus, Edit, Trash2, Eye, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../api/client';
import QuestionModal from '../components/QuestionModal';
import AttemptModal from '../components/AttemptModal';

const CATEGORIES = ['All', 'C', 'C++', 'Python', 'Java', 'OOP', 'SQL'];

const AdminDashboardPage = ({ setView }) => {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'attempts'
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [attemptModalOpen, setAttemptModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  // Fetch Questions (with correct answers & explanations)
  const fetchAdminQuestions = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/admin/questions');
      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error('Failed to fetch admin questions:', err);
      setErrorMsg('Failed to load questions from database.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Attempts
  const fetchAdminAttempts = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/admin/attempts');
      if (res.data.success) {
        setAttempts(res.data.attempts.sort((a, b) => b.score - a.score));
      }
    } catch (err) {
      console.error('Failed to fetch attempts:', err);
      setErrorMsg('Failed to load attempts log.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'questions') {
      fetchAdminQuestions();
    } else {
      fetchAdminAttempts();
    }
  }, [activeTab]);

  // Question Actions
  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setQuestionModalOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (id, order) => {
    if (!window.confirm(`Are you sure you want to delete Question #${order}?`)) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete question');
    }
  };

  // Attempt Actions
  const handleInspectAttempt = (attempt) => {
    setSelectedAttempt(attempt);
    setAttemptModalOpen(true);
  };

  const handleDeleteAttempt = async (id, studentName) => {
    if (!window.confirm(`Delete submission record for ${studentName}?`)) return;
    try {
      await api.delete(`/admin/attempts/${id}`);
      setAttempts((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete attempt');
    }
  };

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch =
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate Metrics
  const totalQuestions = questions.length;
  const totalAttempts = attempts.length;
  const avgScore = totalAttempts > 0
    ? (attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts).toFixed(1)
    : '0';

  return (
    <div className="terminal-window fade-in" style={{ maxWidth: '1240px' }}>
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-title">
          <span>root@dashboard://</span>
          <span className="active-term">admin_control_unit</span>
        </div>
        <div className="terminal-meta">
          <button
            className="btn-term btn-secondary"
            style={{ fontSize: '11px', padding: '4px 10px' }}
            onClick={() => (activeTab === 'questions' ? fetchAdminQuestions() : fetchAdminAttempts())}
          >
            <RefreshCw size={12} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      <div className="terminal-body">
        {/* Metric Cards Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            marginBottom: '20px'
          }}
        >
          <div style={{ background: '#080b12', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '14px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Active Question Bank</div>
            <div style={{ color: 'var(--neon-cyan)', fontSize: '24px', fontWeight: 800, marginTop: '2px' }}>
              {totalQuestions} / 25
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>6 Core Domains</div>
          </div>

          <div style={{ background: '#080b12', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '14px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Candidate Submissions</div>
            <div style={{ color: 'var(--neon-green)', fontSize: '24px', fontWeight: 800, marginTop: '2px' }}>
              {totalAttempts}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Recorded Attempts</div>
          </div>

          <div style={{ background: '#080b12', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '14px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Average Score</div>
            <div style={{ color: 'var(--neon-amber)', fontSize: '24px', fontWeight: 800, marginTop: '2px' }}>
              {avgScore} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ {totalQuestions || 25}</span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Cohort Performance</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
          <button
            className={`btn-term ${activeTab === 'questions' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('questions')}
          >
            <Database size={15} />
            <span>QUESTIONS.DB ({questions.length})</span>
          </button>
          <button
            className={`btn-term ${activeTab === 'attempts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('attempts')}
          >
            <ListChecks size={15} />
            <span>ATTEMPTS.LOG ({attempts.length})</span>
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(255, 51, 102, 0.1)',
              border: '1px solid var(--neon-red)',
              color: 'var(--neon-red)',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '13px'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* ================= TAB 1: QUESTIONS ================= */}
        {activeTab === 'questions' && (
          <div>
            {/* Filter and Add Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '18px'
              }}
            >
              {/* Category Filter Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`btn-term ${selectedCategory === cat ? 'btn-cyan' : 'btn-secondary'}`}
                    style={{ fontSize: '11px', padding: '5px 10px' }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & Add */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="term-input"
                    placeholder="Search question..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '32px', fontSize: '12px', width: '200px' }}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                </div>

                <button className="btn-term btn-primary" onClick={handleOpenCreateModal}>
                  <Plus size={15} />
                  <span>NEW QUESTION</span>
                </button>
              </div>
            </div>

            {/* Questions Table / List */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Reading questions from MongoDB cluster...
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No questions match the current filter.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredQuestions.map((q) => (
                  <div
                    key={q._id}
                    style={{
                      background: '#090d16',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '14px',
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr auto',
                      gap: '14px',
                      alignItems: 'center'
                    }}
                  >
                    {/* Order & Category */}
                    <div>
                      <div style={{ color: 'var(--neon-green)', fontWeight: 700, fontSize: '14px' }}>
                        #{q.paperOrder}
                      </div>
                      <span className="badge-cat badge-c" style={{ fontSize: '10px', padding: '2px 6px', marginTop: '4px' }}>
                        {q.category}
                      </span>
                    </div>

                    {/* Question summary */}
                    <div>
                      <div style={{ color: '#ffffff', fontWeight: 500, fontSize: '13px', marginBottom: '4px' }}>
                        {q.text.length > 120 ? `${q.text.substring(0, 120)}...` : q.text}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Answer: <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>Option {q.correctIndex + 1} ({q.options[q.correctIndex]})</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-term btn-secondary"
                        style={{ padding: '6px 10px' }}
                        onClick={() => handleOpenEditModal(q)}
                        title="Edit question"
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="btn-term btn-danger"
                        style={{ padding: '6px 10px' }}
                        onClick={() => handleDeleteQuestion(q._id, q.paperOrder)}
                        title="Delete question"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: ATTEMPTS ================= */}
        {activeTab === 'attempts' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Parsing attempt log streams...
              </div>
            ) : attempts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No student attempts recorded yet.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 10px' }}>CANDIDATE</th>
                      <th style={{ padding: '12px 10px' }}>REG NO</th>
                      <th style={{ padding: '12px 10px' }}>SCORE</th>
                      <th style={{ padding: '12px 10px' }}>ACCURACY</th>
                      <th style={{ padding: '12px 10px' }}>TIME SPENT</th>
                      <th style={{ padding: '12px 10px' }}>TIMESTAMP</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((att) => {
                      const mins = Math.floor((att.timeSpentSeconds || 0) / 60);
                      const secs = (att.timeSpentSeconds || 0) % 60;
                      return (
                        <tr
                          key={att._id}
                          style={{
                            borderBottom: '1px solid #141c2c',
                            transition: 'background 0.15s'
                          }}
                        >
                          <td style={{ padding: '12px 10px', fontWeight: 600, color: '#ffffff' }}>
                            {att.studentName}
                          </td>
                          <td style={{ padding: '12px 10px', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>
                            {att.studentId}
                          </td>
                          <td style={{ padding: '12px 10px', color: 'var(--neon-green)', fontWeight: 700 }}>
                            {att.score} / {att.totalQuestions}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <span
                              style={{
                                color: att.percentage >= 50 ? 'var(--neon-green)' : 'var(--neon-red)',
                                fontWeight: 600
                              }}
                            >
                              {att.percentage}%
                            </span>
                          </td>
                          <td style={{ padding: '12px 10px', color: 'var(--neon-amber)' }}>
                            {mins}m {secs}s
                          </td>
                          <td style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '12px' }}>
                            {new Date(att.submittedAt).toLocaleDateString()} {new Date(att.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button
                                className="btn-term btn-cyan"
                                style={{ fontSize: '11px', padding: '4px 10px' }}
                                onClick={() => handleInspectAttempt(att)}
                              >
                                <Eye size={13} />
                                <span>Inspect</span>
                              </button>
                              <button
                                className="btn-term btn-danger"
                                style={{ fontSize: '11px', padding: '4px 8px' }}
                                onClick={() => handleDeleteAttempt(att._id, att.studentName)}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Question Create/Edit Modal */}
      <QuestionModal
        isOpen={questionModalOpen}
        question={editingQuestion}
        onClose={() => setQuestionModalOpen(false)}
        onSaveSuccess={() => {
          fetchAdminQuestions();
        }}
      />

      {/* Attempt Inspector Modal */}
      <AttemptModal
        isOpen={attemptModalOpen}
        attempt={selectedAttempt}
        onClose={() => setAttemptModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboardPage;
