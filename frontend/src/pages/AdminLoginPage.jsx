import React, { useState } from 'react';
import { Lock, User, Key, ArrowLeft, ShieldAlert, Terminal } from 'lucide-react';
import { useQuiz } from '../QuizContext';

const AdminLoginPage = ({ setView }) => {
  const { loginAdmin } = useQuiz();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const result = await loginAdmin(username.trim(), password.trim());
    setLoading(false);

    if (result.success) {
      setView('admin_dash');
    } else {
      setErrorMsg(result.message || 'Access denied: Invalid credentials');
    }
  };

  return (
    <div className="terminal-window fade-in" style={{ maxWidth: '520px', margin: '4rem auto' }}>
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-title">
          <span>auth://</span>
          <span className="active-term">admin_portal.sh</span>
        </div>
        <div className="terminal-meta">
          <span>SECURITY: 8h JWT</span>
        </div>
      </div>

      <div className="terminal-body" style={{ padding: '28px' }}>
        <div className="prompt-line">
          <span className="user-host">sysadmin@core</span>
          <span>:</span>
          <span className="dir">~</span>
          <span>$</span>
          <span className="cmd">sudo authenticate --role=admin</span>
          <span className="cursor-blink"></span>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#ffffff', fontWeight: 700, marginBottom: '6px' }}>
            ADMINISTRATOR CONSOLE
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            Elevated access for Question Bank maintenance and Attempt auditing.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(255, 51, 102, 0.1)',
              border: '1px solid var(--neon-red)',
              color: 'var(--neon-red)',
              padding: '10px 14px',
              borderRadius: '4px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px'
            }}
          >
            <ShieldAlert size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="term-input-group">
            <label className="term-label">
              <User size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Admin Identifier
            </label>
            <input
              type="text"
              className="term-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username..."
              required
              autoFocus
            />
          </div>

          <div className="term-input-group">
            <label className="term-label">
              <Key size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Root Password
            </label>
            <input
              type="password"
              className="term-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div
            style={{
              background: 'rgba(0, 240, 255, 0.05)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '4px',
              padding: '10px 12px',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Default Seed Credentials: <strong>admin</strong> / <strong>admin123</strong></span>
            <span style={{ color: 'var(--neon-green)' }}>8-Hour Token</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-term btn-secondary"
              onClick={() => setView('terms')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="btn-term btn-primary"
              disabled={loading}
              style={{ flex: 2, justifyContent: 'center' }}
            >
              <Lock size={14} />
              <span>{loading ? 'Authenticating...' : 'Sign In as Root'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
