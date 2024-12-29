import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/AuthorizationService';
import '../styles/loginAndRegister.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setUsernameError(false);
    setPasswordError(false);

    if (!username || !password) {
      if (!username) setUsernameError(true);
      if (!password) setPasswordError(true);
      return;
    }

    loginUser(username, password, setError, navigate);
  };

  return (
    <div className="login-container">
      <div className="box">
        <h2>Авторизація</h2>
        <form onSubmit={handleLogin} className="form-group">
          <div className="form-group">
            <label>Логін</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={usernameError ? 'error' : ''}
              placeholder={usernameError ? 'Поле "Логін" не може бути порожнім' : ''}
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? 'error' : ''}
              placeholder={passwordError ? 'Поле "Пароль" не може бути порожнім' : ''}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Увійти</button>
        </form>
        <p className='plogin'>
          Немає акаунту?{' '}
          <Link to="/register" className='plink'>
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
