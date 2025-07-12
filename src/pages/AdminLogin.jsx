import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AdminLogin = ({ url }) => {

  const navigate = useNavigate();
  const [data, setData] = useState({ 
    email: '',
     password: ''
   });
   
 

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    
    try {
      const res = await axios.post(url + "/api/admin/login", data);
      if(!res){
        console.log("no response")
      }
      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        toast.success("Login successful");
        navigate("/"); 
      }
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
