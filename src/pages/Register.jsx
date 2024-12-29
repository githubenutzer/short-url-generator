import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleRegister } from '../services/AuthorizationService';
import '../styles/loginAndRegister.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setUsernameError(false);
    setPasswordError(false);
    setFullNameError(false);

    if (!username || !password || !fullName) {
      if (!username) setUsernameError(true);
      if (!password) setPasswordError(true);
      if (!fullName) setFullNameError(true);
      return;
    }

    if (password.length < 8) {
      setPasswordError(true);
      setError('Пароль має бути не менше 8 символів');
      return;
    }

    handleRegister(username, password, fullName, setError, navigate);
  };

  return (
    <div className="register-container">
      <div className="box">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Реєстрація</h2>
          <div className="form-group">
            <label>Логін:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={usernameError ? 'error' : ''}
              placeholder={usernameError ? 'Поле "Логін" не може бути порожнім' : ''}
            />
          </div>
          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? 'error' : ''}
              placeholder={passwordError ? 'Поле "Пароль" не може бути порожнім' : ''}
            />
          </div>
          <div className="form-group">
            <label>Повне ім'я:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={fullNameError ? 'error' : ''}
              placeholder={fullNameError ? 'Поле "Імя" не може бути порожнім' : ''}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Зареєструватися</button>
        </form>
        <p className='plogin'>
          Вже є акаунт?{' '}
          <Link to="/login" className='plink'>
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
