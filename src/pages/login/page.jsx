import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LockKeyhole, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { toasty } from "@/lib/toasty.js";
import Desktop_Guy from "@/assets/3d_desktop_guy.svg";
import { loginSchema } from "@/schemas/index.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { axiosInstance } from "@/config/axiosInstance.js";
import { login } from "@/config/api.js";
import useSession from "@/hooks/useSession.js";
import { Link, Navigate } from "react-router-dom";
import { useLoading } from "@/hooks/useLoading.js";
import ButtonGoogle from "@/components/ButtonGoogle.jsx";
export default function Login() {
  const { session, refreshSession } = useSession();
  const { setLoading } = useLoading();
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });
  async function onSubmit(values) {
    try {
      setLoading(true);
      const response = await axiosInstance.post(login, values);
      localStorage.setItem("token", response?.data?.token);
      refreshSession();
      toasty("success", response.data.message || `Welcome ${values.username}`);
    } catch (error) {
      toasty("error", error);
    } finally {
      setLoading(false);
    }
  }
  if (session && Object.keys(session || {}).length) {
    return <Navigate to="/" />;
  }
  return (
    <div className="w-full h-full flex justify-center lg:px-20 md:px-10 px-4 pb-20 items-center gap-5">
      <div className="md:flex-1 flex flex-col gap-5 sm:w-2/3 w-full">
        <div className="sm:text-4xl text-3xl font-semibold">
          Login to ChatVibes
        </div>
        <div className="flex flex-col gap-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-4 flex-col [&>*]:w-full">
              <div>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username:</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          domBefore={
                            <div className="absolute top-2/4 -translate-y-2/4 left-2">
                              <User />
                            </div>
                          }
                          className="px-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password:</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type={"password"}
                          domBefore={
                            <div className="absolute top-2/4 -translate-y-2/4 left-2">
                              <LockKeyhole />
                            </div>
                          }
                          className="px-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button>Submit</Button>
            </form>
          </Form>
          <ButtonGoogle />
          <div className="underline hover:no-underline text-main-blue text-center text-sm">
            <Link to={"/register"}>Don't have an account ?</Link>
          </div>
        </div>
      </div>
      <div className="md:flex items-center justify-center lg:p-10 h-full hidden lg:w-[60%] w-[45%]">
        <img src={Desktop_Guy} />
      </div>
    </div>
  );
}
