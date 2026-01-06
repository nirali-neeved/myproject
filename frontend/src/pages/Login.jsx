import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ emailOrUsername: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setForm({ emailOrUsername: "", password: "" });

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return setMsg(data.message);

    localStorage.setItem("token", data.token);
    setMsg("Login successful");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 w-96 rounded shadow"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          className="w-full p-2 border mb-3"
          placeholder="Email or Username"
          value={form.emailOrUsername}
          onChange={(e) =>
            setForm({ ...form, emailOrUsername: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full p-2 border mb-3"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>

        {msg && (
          <p className={`mt-3 ${res.ok ? "text-green-600" : "text-red-500"}`}>
            {msg}
          </p>
        )}

        <p className="text-sm mt-3">
          <Link to="/forget-password" className="text-blue-500">
            Forgot Password?
          </Link>
        </p>

        <p className="text-sm mt-2">
          <Link to="/reset-password" className="text-blue-500">
            Reset Password
          </Link>
        </p>

        <p className="mt-4 text-sm">
          No account? 
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
