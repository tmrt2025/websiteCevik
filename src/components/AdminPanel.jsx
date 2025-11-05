import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../css/smartAdminPanel.css"

const SecureAdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState({});
  const [currentFile, setCurrentFile] = useState('');
  const [smartFields, setSmartFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockUntil, setLockUntil] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // 🔐 Environment variables
  const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
  const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === "true";
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCK_TIME_MINUTES = 30;
  const SESSION_TIMEOUT_MINUTES = 60;

  const navigate = useNavigate();
  const location = useLocation();

  const jsonFiles = [
    'aboutUsContent',
    'organizationCommittee',
    'registrationContent',
    'absSubm',
    'accomodation',
    'schedule',
    'schedule2',
    'workshopContent',
    'socialProgram',
    'sponsors'
  ];

  // 🕒 Session timeout kontrolü
  useEffect(() => {
    if (isAuthenticated) {
      const activityInterval = setInterval(() => {
        const now = Date.now();
        const inactiveTime = now - lastActivity;
        const timeoutMs = SESSION_TIMEOUT_MINUTES * 60 * 1000;

        if (inactiveTime > timeoutMs) {
          handleAutoLogout('Session expired due to inactivity');
        }
      }, 60000);

      return () => clearInterval(activityInterval);
    }
  }, [isAuthenticated, lastActivity]);

  // 🎯 Aktivite takibi
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // 🚫 Lock kontrolü
  useEffect(() => {
    const checkLock = () => {
      if (lockUntil && Date.now() < lockUntil) {
        setIsLocked(true);
      } else {
        setIsLocked(false);
        setLockUntil(null);
        setLoginAttempts(0);
      }
    };

    checkLock();
    const lockInterval = setInterval(checkLock, 1000);
    return () => clearInterval(lockInterval);
  }, [lockUntil]);

  // Admin panel kapalı mı kontrol et
  useEffect(() => {
    if (!ADMIN_ENABLED && location.pathname === '/admin') {
      navigate('/');
    }
  }, [ADMIN_ENABLED, location.pathname, navigate]);

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    const sessionExpiry = localStorage.getItem('adminSessionExpiry');

    if (savedAuth === 'true' && sessionExpiry && Date.now() < parseInt(sessionExpiry)) {
      setIsAuthenticated(true);
      loadAllFiles();
      updateActivity();
    } else {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminSessionExpiry');
    }
  }, []);

  const loadAllFiles = async () => {
    console.log('🔄 Starting to load all files...');
    const loadedFiles = {};

    for (const file of jsonFiles) {
      try {
        console.log(`📂 Loading file: ${file}`);

        const saved = localStorage.getItem(`cms_${file}`);
        if (saved) {
          console.log(`✅ Loaded from localStorage: ${file}`);
          loadedFiles[file] = JSON.parse(saved);
        } else {
          const response = await fetch(`/content/${file}.json`);
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Successfully loaded: ${file}`, data);
            loadedFiles[file] = data;
            localStorage.setItem(`cms_${file}`, JSON.stringify(data));
          } else {
            console.error(`❌ Failed to load: ${file}`, response.status);
          }
        }
      } catch (error) {
        console.error(`💥 Error loading ${file}:`, error);
      }
    }

    console.log('🎉 All files loaded:', loadedFiles);
    setFiles(loadedFiles);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    updateActivity();

    if (isLocked) {
      const remainingTime = Math.ceil((lockUntil - Date.now()) / 60000);
      alert(`🔒 Account is locked. Try again in ${remainingTime} minutes.`);
      return;
    }

    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockTime = Date.now() + (LOCK_TIME_MINUTES * 60 * 1000);
      setLockUntil(lockTime);
      setIsLocked(true);
      alert(`🚫 Too many failed attempts. Account locked for ${LOCK_TIME_MINUTES} minutes.`);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginAttempts(0);

      const sessionExpiry = Date.now() + (SESSION_TIMEOUT_MINUTES * 60 * 1000);
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminSessionExpiry', sessionExpiry.toString());

      loadAllFiles();
      alert('✅ Login successful!');
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts;

      if (remainingAttempts > 0) {
        alert(`❌ Invalid credentials. ${remainingAttempts} attempts remaining.`);
      } else {
        const lockTime = Date.now() + (LOCK_TIME_MINUTES * 60 * 1000);
        setLockUntil(lockTime);
        setIsLocked(true);
        alert(`🚫 Account locked for ${LOCK_TIME_MINUTES} minutes.`);
      }

      setPassword('');
    }
  };

  const handleAutoLogout = (reason = 'Auto logout') => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminSessionExpiry');
    alert(`🔐 ${reason}`);
  };

  const handleLogout = () => {
    handleAutoLogout('Logged out successfully');
  };

  // 🎯 ÖZELLEŞTİRİLMİŞ TEXT ALANLARI ÇIKARMA
  const extractTextFields = (obj, prefix = '', fileName = '') => {
    const fields = [];

    console.log('🔍 extractTextFields called for:', fileName);

    const processValue = (value, key, currentPrefix, depth = 0) => {
      const fullPath = currentPrefix ? `${currentPrefix}.${key}` : key;

      // Özel dosya tipleri için optimize edilmiş field extraction
      if (fileName.includes('scientificProgram')) {
        // Scientific Program için özel logic
        if (typeof value === 'string' && value.length > 0) {
          // Schedule içindeki önemli alanlar
          if (fullPath.includes('schedule') &&
            (key === 'title' || key === 'speaker' || key === 'moderator')) {
            fields.push({
              path: fullPath,
              label: `${key.charAt(0).toUpperCase() + key.slice(1)} (${fileName})`,
              value: value,
              type: 'text',
              category: 'Scientific Program'
            });
          }
          // Ana bilgiler
          else if (['pageTitle', 'date', 'location'].includes(key)) {
            fields.push({
              path: fullPath,
              label: `${key.charAt(0).toUpperCase() + key.slice(1)} (${fileName})`,
              value: value,
              type: 'text',
              category: 'Program Info'
            });
          }
        }
      }
      else if (fileName.includes('aboutUsContent')) {
        // About Us için özel logic
        if (typeof value === 'string' && value.length > 10) {
          if (fullPath.includes('scientificBoard') ||
            fullPath.includes('purpose') ||
            fullPath.includes('scope')) {
            fields.push({
              path: fullPath,
              label: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
              value: value,
              type: key === 'content' ? 'textarea' : 'text',
              category: 'About Us'
            });
          }
        }
      }
      else if (fileName.includes('workshopsContent')) {
        // Workshops için özel logic
        if (typeof value === 'string' && value.length > 0) {
          if (fullPath.includes('workshops') &&
            (key === 'title' || key === 'description')) {
            fields.push({
              path: fullPath,
              label: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
              value: value,
              type: key === 'description' ? 'textarea' : 'text',
              category: 'Workshops'
            });
          }
        }
      }
      else if (fileName.includes('socialProgramContent')) {
        // Social Program için özel logic
        if (typeof value === 'string' && value.length > 0) {
          if (fullPath.includes('intro') ||
            (fullPath.includes('events') &&
              (key === 'title' || key === 'date' || key === 'time' || key === 'location'))) {
            fields.push({
              path: fullPath,
              label: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
              value: value,
              type: key === 'content' ? 'textarea' : 'text',
              category: 'Social Program'
            });
          }
        }
      }
      else if (fileName.includes('abstractSubmission')) {
        // Abstract Submission için özel logic
        if (typeof value === 'string' && value.length > 0) {
          if (fullPath.includes('sections') && key === 'content') {
            fields.push({
              path: fullPath,
              label: 'Content',
              value: value,
              type: 'textarea',
              category: 'Abstract Submission'
            });
          }
        }
      }
      else if (fileName.includes('accommodationContent')) {
        // Accommodation için özel logic
        if (typeof value === 'string' && value.length > 0) {
          if (fullPath.includes('intro') ||
            (fullPath.includes('accommodationOptions') &&
              (key === 'name' || key === 'description'))) {
            fields.push({
              path: fullPath,
              label: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
              value: value,
              type: key === 'description' ? 'textarea' : 'text',
              category: 'Accommodation'
            });
          }
        }
      }
      else if (fileName.includes('registrationContent')) {
        // Registration için özel logic
        if (typeof value === 'string' && value.length > 0) {
          if (fullPath.includes('sections') &&
            (key === 'content' || key === 'text')) {
            fields.push({
              path: fullPath,
              label: 'Content',
              value: value,
              type: 'textarea',
              category: 'Registration'
            });
          }
        }
      }
      else if (fileName.includes('organizationCommittee')) {
        // Organization Committee için özel logic
        if (typeof value === 'string' && value.length > 0) {
          // İsim ve rol bilgileri
          if (key === 'name' || key === 'role') {
            fields.push({
              path: fullPath,
              label: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
              value: value,
              type: 'text',
              category: 'Organization'
            });
          }
        }
      }
      else if (fileName.includes('sponsorsContent')) {
        // Sponsors için özel logic
        if (typeof value === 'string' && value.length > 0) {
          if (key === 'pageTitle') {
            fields.push({
              path: fullPath,
              label: 'Page Title',
              value: value,
              type: 'text',
              category: 'Sponsors'
            });
          }
        }
      }
      else {
        // Genel fallback - tüm string'leri göster
        if (typeof value === 'string' && value.length > 3 && !value.startsWith('http') && !value.includes('.png') && !value.includes('.pdf')) {
          fields.push({
            path: fullPath,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value: value,
            type: value.length > 100 ? 'textarea' : 'text',
            category: 'General'
          });
        }
      }

      // Recursive object processing
      if (typeof value === 'object' && value !== null && depth < 5) {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object') {
              processValue(item, index.toString(), fullPath, depth + 1);
            } else if (typeof item === 'string') {
              processValue(item, index.toString(), fullPath, depth + 1);
            }
          });
        } else {
          for (const nestedKey in value) {
            processValue(value[nestedKey], nestedKey, fullPath, depth + 1);
          }
        }
      }
    };

    for (const key in obj) {
      processValue(obj[key], key, prefix, 0);
    }

    console.log(`🎯 Total fields extracted for ${fileName}:`, fields.length);
    return fields;
  };

  const selectFile = (filename) => {
    console.log('📁 Selecting file:', filename);
    setCurrentFile(filename);
    setSearchTerm('');
    const content = files[filename] || {};

    console.log('📄 File content:', content);
    const fields = extractTextFields(content, '', filename);
    console.log('🎯 Extracted fields:', fields);
    setSmartFields(fields);
  };

  // 🔍 Arama filtresi
  const filteredFields = smartFields.filter(field =>
    field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✏️ Alan değişikliği
  const handleFieldChange = (path, newValue) => {
    console.log('✏️ Field changed:', { path, newValue });
    const updatedFields = smartFields.map(field =>
      field.path === path ? { ...field, value: newValue } : field
    );
    setSmartFields(updatedFields);
  };

  // 🎯 Nested object değer güncelleme
  const updateNestedValue = (obj, path, value) => {
    const pathParts = path.split('.');
    let current = obj;

    for (let i = 0; i < pathParts.length - 1; i++) {
      let part = pathParts[i];

      if (part.includes('[')) {
        const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
        if (arrayMatch && current[arrayMatch[1]]) {
          current = current[arrayMatch[1]][parseInt(arrayMatch[2])];
        } else {
          return false;
        }
      } else {
        if (!current[part]) return false;
        current = current[part];
      }
    }

    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart.includes('[')) {
      const arrayMatch = lastPart.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch && current[arrayMatch[1]]) {
        current[arrayMatch[1]][parseInt(arrayMatch[2])] = value;
        return true;
      }
    } else {
      current[lastPart] = value;
      return true;
    }

    return false;
  };

  // 💾 Değişiklikleri kaydet
  const saveChanges = () => {
    try {
      console.log('💾 Saving changes for:', currentFile);
      const updatedContent = JSON.parse(JSON.stringify(files[currentFile]));

      smartFields.forEach(field => {
        if (!updateNestedValue(updatedContent, field.path, field.value)) {
          console.warn(`Could not update path: ${field.path}`);
        }
      });

      const updatedFiles = { ...files, [currentFile]: updatedContent };
      setFiles(updatedFiles);
      localStorage.setItem(`cms_${currentFile}`, JSON.stringify(updatedContent));

      alert('✅ Changes saved successfully! Refresh page to see updates.');

    } catch (error) {
      alert(`❌ Error saving: ${error.message}`);
    }
  };

  // 🔄 Orijinaline dön
  const resetToOriginal = async () => {
    if (confirm('Reset to original content?')) {
      try {
        const response = await fetch(`/content/${currentFile}.json`);
        if (response.ok) {
          const originalData = await response.json();
          const updatedFiles = { ...files, [currentFile]: originalData };
          setFiles(updatedFiles);
          localStorage.removeItem(`cms_${currentFile}`);

          const fields = extractTextFields(originalData, '', currentFile);
          setSmartFields(fields);

          alert('✅ Reset to original content!');
        }
      } catch (error) {
        alert('❌ Error resetting file');
      }
    }
  };

  // Kategorilere göre grupla
  const groupedFields = filteredFields.reduce((groups, field) => {
    const category = field.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(field);
    return groups;
  }, {});

  // 🎯 Aktivite takibi event'leri
  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

      const updateActivityHandler = () => updateActivity();

      events.forEach(event => {
        document.addEventListener(event, updateActivityHandler);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, updateActivityHandler);
        });
      };
    }
  }, [isAuthenticated, updateActivity]);

  // 🔒 Admin panel kapalıysa
  if (!ADMIN_ENABLED) {
    return (
      <div className="admin-disabled">
        <div className="security-message">
          <h2>🚫 Access Denied</h2>
          <p>Admin panel is currently disabled.</p>
        </div>
      </div>
    );
  }

  // 🚫 Lock screen
  if (isLocked) {
    const remainingTime = Math.ceil((lockUntil - Date.now()) / 60000);
    return (
      <div className="admin-login-page">
        <div className="login-container">
          <div className="security-alert">
            <h2>🔒 Account Locked</h2>
            <p>Too many failed login attempts.</p>
            <p>Please try again in <strong>{remainingTime}</strong> minutes.</p>
            <div className="lock-timer">
              <div className="timer-bar">
                <div
                  className="timer-progress"
                  style={{
                    width: `${((lockUntil - Date.now()) / (LOCK_TIME_MINUTES * 60 * 1000)) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && location.pathname === '/admin') {
    const remainingAttempts = MAX_LOGIN_ATTEMPTS - loginAttempts;

    return (
      <div className="admin-login-page">
        <div className="login-container">
          <div className="security-header">
            <h2>🔐 Secure Admin Login</h2>
            <div className="security-badge">
              <span className="secure-indicator">🔒 Secure Connection</span>
            </div>
          </div>

          <p className="login-info">Authentication Required</p>

          {loginAttempts > 0 && (
            <div className="attempts-warning">
              <span>⚠️ {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="login-input"
                required
                disabled={isLocked}
              />
            </div>

            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="password-input"
                required
                disabled={isLocked}
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={isLocked}
            >
              {isLocked ? '🔒 Locked' : '🔐 Login'}
            </button>
          </form>

          <div className="security-features">
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <span>Brute Force Protection</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⏱️</span>
              <span>Session Timeout: {SESSION_TIMEOUT_MINUTES}min</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔐</span>
              <span>Auto-logout on Inactivity</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Kalan süre gösterimi
  const remainingSessionTime = Math.ceil(
    (parseInt(localStorage.getItem('adminSessionExpiry') || Date.now()) - Date.now()) / 60000
  );

  return (
    <div className="secure-admin-panel" onClick={updateActivity}>
      <div className="admin-header">
        <div className="header-left">
          <h2>🎯 Smart Content Editor</h2>
          <span className="file-indicator">
            {currentFile ? `Editing: ${currentFile}.json` : 'Select a file to edit'}
          </span>
          <div className="session-info">
            <span className="session-timer">
              ⏰ Session: {remainingSessionTime > 0 ? `${remainingSessionTime}m` : 'Expired'}
            </span>
          </div>
        </div>
        <div className="header-actions">
          {currentFile && (
            <>
              <span className="fields-count">
                {smartFields.length} editable fields
              </span>
              <button onClick={resetToOriginal} className="reset-btn">
                🔄 Reset
              </button>
            </>
          )}
          <button onClick={handleLogout} className="logout-btn">
            🚪 Secure Logout
          </button>
        </div>
      </div>

      <div className="admin-layout">
        {/* Dosya Listesi */}
        <div className="file-sidebar">
          <h3>📄 Content Files</h3>
          <div className="file-list">
            {jsonFiles.map(file => (
              <div
                key={file}
                onClick={() => selectFile(file)}
                className={`file-item ${currentFile === file ? 'active' : ''}`}
              >
                <span className="file-icon">📄</span>
                <span className="file-name">{file}.json</span>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Alanı */}
        <div className="editor-main">
          {currentFile ? (
            <>
              {/* Arama ve İstatistik */}
              <div className="editor-toolbar">
                <div className="search-box">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Search fields..."
                    className="search-input"
                  />
                  {searchTerm && (
                    <span className="search-results">
                      {filteredFields.length} results
                    </span>
                  )}
                </div>

                <div className="toolbar-actions">
                  <button onClick={saveChanges} className="save-btn">
                    💾 Save All Changes
                  </button>
                </div>
              </div>

              {/* Editör İçeriği */}
              <div className="smart-editor">
                {Object.keys(groupedFields).length > 0 ? (
                  Object.entries(groupedFields).map(([category, categoryFields]) => (
                    <div key={category} className="category-section">
                      <h4 className="category-title">
                        {category} <span className="field-count">({categoryFields.length})</span>
                      </h4>
                      <div className="fields-grid">
                        {categoryFields.map((field, index) => (
                          <div key={field.path} className="field-card">
                            <label className="field-label">
                              {field.label}
                              <span className="field-path">({field.path})</span>
                            </label>

                            {field.type === 'textarea' ? (
                              <textarea
                                value={field.value}
                                onChange={(e) => handleFieldChange(field.path, e.target.value)}
                                className="field-textarea"
                                rows={4}
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                              />
                            ) : (
                              <input
                                type="text"
                                value={field.value}
                                onChange={(e) => handleFieldChange(field.path, e.target.value)}
                                className="field-input"
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                              />
                            )}

                            <div className="field-meta">
                              <span className="field-type">{field.type}</span>
                              <span className="field-length">{field.value.length} chars</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-fields">
                    <h3>📝 No Editable Fields Found</h3>
                    <p>This JSON file doesn't contain editable text fields or no fields match your search.</p>
                    <div className="debug-info">
                      <p><strong>Debug Info:</strong></p>
                      <p>Current File: {currentFile}</p>
                      <p>Total Fields: {smartFields.length}</p>
                      <p>Filtered Fields: {filteredFields.length}</p>
                      <p>Search Term: "{searchTerm}"</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="welcome-screen">
              <h3>👋 Welcome to Smart Content Editor</h3>
              <p>Select a content file from the sidebar to start editing.</p>
              <div className="features-list">
                <div className="feature">
                  <strong>🎯 Smart Detection</strong>
                  <span>Automatically finds editable text fields</span>
                </div>
                <div className="feature">
                  <strong>📂 Organized by Category</strong>
                  <span>Groups related fields together</span>
                </div>
                <div className="feature">
                  <strong>🔍 Smart Search</strong>
                  <span>Quickly find specific fields</span>
                </div>
                <div className="feature">
                  <strong>💾 Auto-save</strong>
                  <span>Changes saved in your browser</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecureAdminPanel;