import React, { useState, useEffect } from 'react';
import { shortenUrl, getUserUrls, getUserName } from '../services/AuthorizationService';
import { useNavigate } from 'react-router-dom';
import '../styles/shortUrlGenerator.css';

const ShortUrlGenerator = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [shortenedUrl, setShortUrl] = useState('');
  const [userUrls, setUserUrls] = useState([]);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Будь ласка, введіть URL');
      return;
    }

    setError('');
    setShortUrl('');

    try {
      const data = await shortenUrl(url);
      setShortUrl(data.short);
      fetchUserUrls();
    } catch (err) {
      console.error('Детальна помилка:', err);
      setError(err.response?.data?.message || err.message || 'Щось пішло не так');
    }
  };

  const fetchUserUrls = async () => {
    try {
      const data = await getUserUrls();
      console.log('Отримані URL:', data);
      setUserUrls(data);
    } catch (err) {
      console.error('Помилка при отриманні URL користувача:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const full_user = await getUserName();
        const user = await getUserName();
        setUserName(full_user.full_name);
        setUser(user.username);
      } catch (error) {
        console.error('Не вдалося отримати ім\'я користувача:', error);
      }
    };

    fetchUserName();
    fetchUserUrls();
  }, []);

  const handleViewAll = () => {
    navigate('/history');
  };

  return (
      <div className="short-url-container">
        <nav className="navigate">
          <div className="logo">🌐 Short URL Generator</div>
          <div className="user-actions">
            <div className="greeting">
              {userName ? `Вітання, ${userName}` : `Вітання, ${user}`}
            </div>
            <div onClick={handleViewAll} className="history-button"><b>HISTORY</b></div>
            <div onClick={handleLogout} className="exit-button"><b>EXIT</b></div>
          </div>
        </nav>

        <div className="main-content">
          <div className="short-url-box">
            <h1>
              Генератор коротких URL-посилань
            </h1>
            <form onSubmit={handleSubmit} className="short-url-form">
              <input
                  type="text"
                  placeholder="Введіть URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={`short-url-input ${error ? 'input-error' : ''}`}
              />
              <button type="submit" className="short-url-button">
                ЗГЕНЕРУВАТИ ⚙️
              </button>
            </form>
            {error && <div className="error-message">{error}</div>}
            {shortenedUrl && (
                <div className="success-message">
                  Ваше коротке посилання:{' '}
                  <a
                      href={`http://localhost:8000/${shortenedUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                    {shortenedUrl}
                  </a>
                </div>
            )}
            <p className="info-text">
              Генератор коротких URL-посилань — це ваш надійний інструмент для скорочення посилань.
            </p>
          </div>

          <div className="user-urls">
            <h2>Ваші останні скорочені URL-посилання:</h2>
            {userUrls.length > 0 ? (
                <ul>
                  {userUrls.slice(0, 3).map((url, index) => (
                      <li key={index}>
                        <p><strong>Скорочене URL-посилання:</strong> <a href={`http://localhost:8000/${url.short}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer">{url.short}</a></p>
                      </li>
                  ))}
                </ul>
            ) : (
                <p>У вас ще немає скорочених URL-посилань</p>
            )}
          </div>
        </div>
      </div>
  );
};

export default ShortUrlGenerator;
