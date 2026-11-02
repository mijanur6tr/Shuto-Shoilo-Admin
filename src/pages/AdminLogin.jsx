import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';

export const AdminLogin = ({ url }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (errorMessage) setErrorMessage('');
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await axios.post(url + "/api/admin/login", data, {
        withCredentials: true
      });

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        toast.success("Welcome, Cafe Administrator!");
        navigate("/");
      } else {
        const msg = res.data.message || "Invalid credentials. Please verify your email and password.";
        setErrorMessage(msg);
        toast.error(msg);
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || (err.response?.status === 401 ? "Invalid admin email or password." : "Server connection failed or network unavailable.");
      setErrorMessage(serverMsg);
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#ccd5ae] p-4 text-[#01472e]">
      <form 
        onSubmit={handleLogin}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-[#01472e]/15 w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#01472e] text-[#fefae0] flex items-center justify-center mx-auto mb-2 text-xl font-bold">
            🌿
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-[#01472e]">
            - SHUTO SHOILI
          </h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">
            Cafe Management Console
          </p>
        </div>

        {/* Prominent Inline Error Display Banner */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5 text-xs animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">
              {errorMessage}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Admin Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="admin@dehan.com"
            value={data.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
              errorMessage 
                ? 'border-red-400 focus:ring-red-300 bg-red-50/20' 
                : 'border-gray-300 focus:ring-[#01472e]'
            }`}
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••••••"
            value={data.password}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
              errorMessage 
                ? 'border-red-400 focus:ring-red-300 bg-red-50/20' 
                : 'border-gray-300 focus:ring-[#01472e]'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#01472e] text-[#fefae0] py-3 rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-[#01472e]/90 transition shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Enter Console</span>
          )}
        </button>
      </form>
    </div>
  );
};
