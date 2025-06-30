import React, { useState } from 'react';
import './Login.css';
import { useDispatch } from 'react-redux';
import { setEmail } from '../../redux/appSlice';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmailInput] = useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_API_URL;

    try {
      const url = isLogin
        ? `${baseUrl}/WebpageAnalyse/login?email=${encodeURIComponent(email)}`
        : `${baseUrl}/WebpageAnalyse/signup?email=${encodeURIComponent(email)}`;

      const response = await fetch(url, { method: 'POST' });

      if (response.ok) {
        const data = await response.json();
        dispatch(setEmail(data.email));
        alert(`${isLogin ? 'Login' : 'Signup'} successful`);
        // navigate('/view-webpages');
      } else {
        const errorText = await response.text();
        alert(errorText || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
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
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmailInput(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      </form>
    </div>
  );
};

export default Login;
