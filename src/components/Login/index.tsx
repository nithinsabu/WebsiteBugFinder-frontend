import React, { useState } from 'react';
import './Login.css';

interface FormState {
  name: string;
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [form, setForm] = useState<FormState>({
    name: '',
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(isLogin ? 'Logging in:' : 'Signing up:', form);
  };

  return (
    <>
    <div className="form-container">
      
      <div className="toggle-buttons">
        <button
          className={isLogin ? 'active' : ''}
          onClick={() => setIsLogin(true)}
          type="button"
        >
          Login
        </button>
        <button
          className={!isLogin ? 'active' : ''}
          onClick={() => setIsLogin(false)}
          type="button"
        >
          Signup
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required={!isLogin}
          />
        )}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      </form>
    </div>
    </>
  );
};

export default Login;
