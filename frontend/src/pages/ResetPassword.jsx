import { useState } from "react";

const ResetPassword = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:3000/api/auth/reset-password-old", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data.message);
      setMsg("Password reset successfully!");
      setUsernameOrEmail(""); setOldPassword(""); setNewPassword("");
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleReset} className="bg-white p-6 w-full max-w-md rounded shadow">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        <input
          type="text"
          placeholder="Username or Email"
          className="w-full p-2 border mb-2"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Old Password"
          className="w-full p-2 border mb-2"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 border mb-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
          Reset Password
        </button>

        {msg && <p className="mt-3 text-green-600">{msg}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
