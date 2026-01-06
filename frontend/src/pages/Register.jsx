import { useState } from "react";
import { z } from "zod";
import { Link } from "react-router-dom";

const schema = z.object({
  username: z.string().min(3, "Username required (min 3 chars)"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "One uppercase required")
    .regex(/[0-9]/, "One number required"),
});

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMsg("");
    setForm({username: "", email: "", password: ""});

    try {
      schema.parse(form);
    } catch (err) {
      const fieldErrors = {};
      err.issues.forEach((i) => (fieldErrors[i.path[0]] = i.message));
      return setErrors(fieldErrors);
    }

    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return setErrors(data.errors || {});
    setMsg(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 w-96 rounded shadow"
      >
        <h2 className="text-xl font-bold mb-4">Register</h2>

        {["username", "email", "password"].map((field) => (
          <div key={field} className="mb-3">
            <input
              type={field === "password" ? "password" : "text"}
              placeholder={field}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {errors[field] && (
              <p className="text-red-500 text-sm">{errors[field]}</p>
            )}
          </div>
        ))}

        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Register
        </button> 

        {msg && <p className="text-green-600 mt-3">{msg}</p>}

        <p className="mt-4 text-sm">
          Already have account?
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
