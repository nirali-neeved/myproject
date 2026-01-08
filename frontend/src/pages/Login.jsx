import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link,useNavigate } from "react-router-dom";
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
import { Card, CardContent } from "@/components/ui/card";

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const [serverMsg, setServerMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setServerMsg("");
    setIsSuccess(false);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        values
      );
      localStorage.setItem("token", data.token);
      setServerMsg("Login successful");
      setIsSuccess(true);
      form.reset();
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerMsg(error.response?.data?.message || "Login failed");
      } else {
        setServerMsg("Network error. Please try again.");
      }
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[380px]">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="emailOrUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Email/Username" {...field} />
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
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {serverMsg && (
                <p
                  className={`text-sm ${
                    isSuccess ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {serverMsg}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Login" : "Login"}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-right mt-2">
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </p>

          <p className="mt-4 text-sm text-center border-t pt-6">
            No account?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold underline"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;