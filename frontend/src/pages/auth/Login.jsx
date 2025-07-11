import React, { useState } from 'react';
import { useLoginMutation } from '../../redux/api/userApiSlice'; 
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { useSelector,useDispatch } from 'react-redux';
import Loader from '../../components/Loader';

const Login = () => {
  const [loginUser, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(formData).unwrap();
      toast.success('Logged in successfully!');
      dispatch(setCredentials({...user}));
      navigate('/');  // Redirect to home or dashboard
    } catch (error) {
      toast.error(error?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto text-white mt-10 p-6 bg-teal-500 rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {isLoading && <Loader/>}

      <p className="mt-4 text-center text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-blue-700 hover:underline">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
