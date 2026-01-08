import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const sendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(1, "OTP is required"),
  newPassword: z
    .string()
    .optional()
});

const ForgotPassword = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(otpSent ? resetPasswordSchema : sendOtpSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
    },
  });

  const handleSendOtp = async (values) => {
    setServerMsg("");
    setIsSuccess(false);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email: values.email }
      );
      setOtpSent(true);
      setServerMsg(data.message || "OTP sent to your email");
      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
      if (axios.isAxiosError(error)) {
        setServerMsg(error.response?.data?.message || "Failed to send OTP");
      } else {
        setServerMsg("Server error");
      }
    }
  };

  const handleResetPassword = async (values) => {
    setServerMsg("");
    setIsSuccess(false);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email: values.email,
          otp: values.otp,
          newPassword: values.newPassword,
        }
      );
      setServerMsg(data.message || "Password reset successful");
      setIsSuccess(true);
      form.reset();
      setOtpSent(false);
      navigate("/login");
    } catch (error) {
      setIsSuccess(false);
      if (axios.isAxiosError(error)) {
        setServerMsg(error.response?.data?.message || "Reset failed");
      } else {
        setServerMsg("Server error");
      }
    }
  };

  const onSubmit = (values) => {
    if (!otpSent) {
      handleSendOtp(values);
    } else {
      handleResetPassword(values);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Forgot Password
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        disabled={otpSent || form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {otpSent && (
                <>
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OTP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter OTP"
                            {...field}
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="New password"
                            {...field}
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? otpSent
                    ? "Reset Password"
                    : "Send OTP"
                  : otpSent
                  ? "Reset Password"
                  : "Send OTP"}
              </Button>
            </form>
          </Form>

          {serverMsg && (
            <p
              className={`mt-4 text-center font-medium ${
                isSuccess ? "text-success" : "text-red-500"
              }`}
            >
              {serverMsg}
            </p>
          )}

          <p className="text-center text-sm mt-6 text-gray-500">
            Remember your password?{" "}
            <Link to="/login" className="text-primary font-semibold underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;