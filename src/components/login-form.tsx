import { useState, FormEvent } from 'react';

const baseUrl = "http://localhost:8000/api/token/";

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Auth Error');
      }
    } catch (err) {
      setError('Network Error');
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <h2 className="mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
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
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;