import Desktop_Guy from "@/assets/3d_desktop_guy.svg";
import { registerSchema } from "@/schemas/index.js";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockKeyhole, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { toasty } from "@/lib/toasty.js";
import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";
import { imageToBlob } from "@/lib/imageToBlob.js";
import { axiosInstance } from "@/config/axiosInstance.js";
import { register } from "@/config/api.js";
import useSession from "@/hooks/useSession.js";
import { Link, Navigate } from "react-router-dom";
import { validateImage } from "image-validator";
import ButtonGoogle from "@/components/ButtonGoogle.jsx";

export default function Register() {
  const { session, refreshSession } = useSession();
  const form = useForm({
    resolver: zodResolver(registerSchema),
  });
  const fileRef = useRef(null);
  async function onSubmit(values) {
    try {
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      const response = await axiosInstance.post(register, formData);
      refreshSession();
      toasty("info", `Welcome ${formData.get("username")}`);
    } catch (error) {
      toasty("error", error);
    }
  }
  async function onFileChange(e, field) {
    const file = e.target.files[0];
    if (!file) return;
    const isValidImage = await validateImage(file);
    if (!isValidImage) {
      toasty("warn", "You can just upload an image");
      e.target.value = "";
      return;
    }
    field.onChange(file);
  }
  if (session && Object.keys(session || {}).length) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full h-full flex justify-center lg:px-20 md:px-10 px-4 pb-20 pt-5 items-center gap-5">
      <div className="md:flex-1 flex flex-col gap-5 sm:w-2/3 w-full">
        <div className="sm:text-4xl text-3xl font-semibold">
          Register to ChatVibes
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
                          placeholder={"Username"}
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
                          placeholder={"Password"}
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
              <div className="flex items-center gap-4">
                <div className="hidden">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="file"
                            {...field}
                            onChange={(e) => onFileChange(e, field)}
                            value={field?.value?.fileName}
                            id="avatar_input"
                            ref={fileRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative">
                  <div>
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={imageToBlob(form.watch("avatar"))} />
                    </Avatar>
                  </div>
                  {form.watch("avatar") && (
                    <div
                      className="absolute bottom-0 right-0 bg-destructive rounded-full p-[.4px] cursor-pointer"
                      onClick={() => {
                        form.setValue("avatar", "");
                        fileRef.current.value = "";
                      }}>
                      <X size={15} />
                    </div>
                  )}
                </div>
                <label htmlFor="avatar_input" className="inline-block w-full">
                  <Button className="w-full" asChild>
                    Add profile image
                  </Button>
                </label>
              </div>
              <Button className=" font-semibold">Submit</Button>
            </form>
          </Form>
          <ButtonGoogle />
          <div className="underline hover:no-underline text-main-blue text-center text-sm">
            <Link to={"/login"}>Already have an account ?</Link>
          </div>
        </div>
      </div>
      <div className="md:flex items-center justify-center lg:p-10 h-full hidden lg:w-[60%] w-[45%]">
        <img src={Desktop_Guy} />
      </div>
    </div>
  );
}
