import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/api/userApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const Register = () => {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {userinfo} = useSelector((state)=>state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(()=>{
    if(userinfo)
        navigate('/');


  },[navigate,userinfo]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle registration logic here
    if (formData.password === formData.confirmPassword) {
      try {
        const userOb = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };

        const result = await registerUser(userOb).unwrap();

        console.log("Registering user:", result);
        dispatch(setCredentials({...result}));
        toast.success("User registered Successfully");
      } catch (error) {
        console.log(error);
        toast.error(`Error --:${error.message}`);
      }
    } 
    else {
      toast.error("Password Does not match!");
    }
  };

  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="max-w-md  z-12 mx-auto mt-10 p-6 bg-teal-500 text-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="username" className="block mb-1 font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
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
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Password"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Confirm password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-800 transition-colors"
        >
          {isLoading?'Registering...':'Register'}
        </button>
      </form>
      {isLoading && <Loader/>}
      <p className="mt-4 text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-800 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
