import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
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

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "One uppercase letter required")
    .regex(/\d/, "One number required")
    .regex(/[\W_]/, "One special character required"),
});

const Register = () => {
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setServerError("");
    setSuccessMsg("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        values
      );
      setSuccessMsg("Verification email sent, check your email");
      form.reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message || "Registration failed");
      } else {
        setServerError("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[380px]">
      <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {serverError && (
                <p className="text-red-500 text-sm">{serverError}</p>
              )}
              {successMsg && (
                <p className="text-green-600 text-sm">{successMsg}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Register" : "Register"}
              </Button>
            </form>
          </Form>
          <p className="text-sm text-center mt-4">
            Already registered?{" "}
            <Link to="/login" className="text-primary underline font-semibold">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
