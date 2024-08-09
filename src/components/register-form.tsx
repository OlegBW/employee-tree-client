import { useState, FormEvent } from 'react';

const baseUrl = "http://localhost:8000/api/register/";

const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Проверка совпадения паролей
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, password2 }),
      });

      if (response.ok) {
        setSuccess('Registration successful! You can now log in.');
        // Опционально перенаправить на страницу логина или очистить форму
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Registration failed');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <h2 className="mb-4">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="mb-3">
          <label htmlFor="formUsername" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="formUsername"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="formEmail" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="formEmail"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="formPassword" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="formPassword"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="formPassword2" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="formPassword2"
            placeholder="Confirm your password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;

