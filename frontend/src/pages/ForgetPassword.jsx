import { useState, useEffect } from "react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:3000/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data.message);
      setOtpSent(true);
      setTimer(180);
      setMsg("OTP sent! Enter OTP and new password below.");
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    }
  };

  // Step 2: Reset Password via OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data.message);
      setMsg("Password reset successful!");
      setEmail(""); setOtp(""); setNewPassword(""); setOtpSent(false); setTimer(0);
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={otpSent ? handleResetPassword : handleSendOtp}
        className="bg-white p-6 w-full max-w-md rounded shadow"
      >
        <h2 className="text-xl font-bold mb-4">Forget Password</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={otpSent}
        />

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="OTP"
              className="w-full p-2 border mb-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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
            <div className="mb-2 text-sm text-gray-500">
              {timer > 0
                ? `OTP expires in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2,"0")} min`
                : "OTP expired."}
            </div>
          </>
        )}

        <button
          type="submit"
          className={`w-full py-2 rounded text-white ${otpSent ? "bg-green-500" : "bg-blue-500"}`}
        >
          {otpSent ? "Reset Password" : "Send OTP"}
        </button>

        {msg && <p className="mt-3 text-green-600">{msg}</p>}
      </form>
    </div>
  );
};

export default ForgetPassword;
