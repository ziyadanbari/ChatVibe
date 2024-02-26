import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu.jsx";
import { Input } from "@/components/ui/input.jsx";
import { UserOption } from "@/components/userOptions.jsx";
import { changePassword, editUser } from "@/config/api.js";
import { axiosInstance } from "@/config/axiosInstance.js";
import useSession from "@/hooks/useSession.js";
import { toasty } from "@/lib/toasty.js";
import { Edit2Icon, ImageDownIcon, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button.jsx";
import { changePasswordSchema } from "@/schemas/index.js";
import { validateImage } from "image-validator";
import { useLoading } from "@/hooks/useLoading.js";

const ICON_SIZE = 18;

function AccountForm({ onSubmit, values }) {
  const { register, setValue, handleSubmit } = useForm();
  useEffect(() => {
    for (let key in values) {
      setValue(key, values[key]);
    }
  }, [values]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="space-y-2">
        <div className="font-semibold">Username:</div>
        <Input {...register("username")} placeholder={"username"} />
      </div>
      <div className=" self-end">
        <Button className="bg-green-600 hover:bg-green-800 text-gray-100 font-semibold">
          Save
        </Button>
      </div>
    </form>
  );
}

function PasswordForm({ onSubmit }) {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="space-y-2">
        <div className="font-semibold">Current password:</div>
        <Input
          {...register("currentPassword")}
          type="password"
          placeholder={"Current password"}
        />
      </div>
      <div className="space-y-2">
        <div className="font-semibold">New password:</div>
        <Input
          {...register("newPassword")}
          type="password"
          placeholder={"new password"}
        />
      </div>
      <div className=" self-end">
        <Button className="bg-green-600 hover:bg-green-800 text-gray-100 font-semibold">
          Save
        </Button>
      </div>
    </form>
  );
}

export default function Profile() {
  const { session, refreshSession } = useSession();
  const [defaultValues, setDefaultValues] = useState({});
  const { setLoading } = useLoading();
  useEffect(() => {
    const SELECTED_FIELDS = ["username", "profile_pic"];
    const newDefaultValues = {};

    if (session && Object.keys(session).length) {
      for (let key in session) {
        const value = session[key];
        if (typeof value === "string" && SELECTED_FIELDS.includes(key)) {
          newDefaultValues[key] = value;
        }
      }
    }

    setDefaultValues(newDefaultValues);
  }, [session, setDefaultValues]);

  const deleteImage = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profile_pic", "");
      await axiosInstance.post(editUser, formData);
      await refreshSession();
    } catch (error) {
      toasty("error", error);
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = async (e) => {
    try {
      setLoading(true);
      const file = e.target.files[0];
      if (!file) return;
      const isValidImage = await validateImage(file);
      if (!isValidImage) {
        toasty("warn", "You can just upload an image");
        e.target.value = "";
        return;
      }
      const formData = new FormData();
      formData.append("profile_pic", file);
      await axiosInstance.post(editUser, formData);
      await refreshSession();
    } catch (error) {
      toasty("error", error);
    } finally {
      e.target.value = "";
      setLoading(false);
    }
  };

  const onFormAccountSubmit = async (values) => {
    try {
      setLoading(true);
      const SELECTED_FIELDS = ["username"];
      const formData = new FormData();
      for (let key in values) {
        if (!SELECTED_FIELDS.includes(key)) continue;
        const value = values[key];
        if (!value) {
          formData.append(key, "");
          continue;
        }
        formData.append(key, value);
      }
      const response = await axiosInstance.post(editUser, formData);
      refreshSession();
      toasty("success", response.data.message || "Changed");
    } catch (error) {
      toasty("error", error);
    } finally {
      setLoading(false);
    }
  };

  const onFormPasswordSubmit = async (values) => {
    try {
      setLoading(true);
      const isFormValid = changePasswordSchema.safeParse(values);
      if (!isFormValid.success)
        throw new Error(JSON.parse(isFormValid.error)[0].message);
      const response = await axiosInstance.post(changePassword, values);
      await refreshSession();
      toasty("success", response.data.message || "Password changed");
    } catch (error) {
      toasty("error", error);
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-full flex justify-center items-center px-2">
      <div className="flex sm:flex-row flex-col gap-4 justify-center lg:w-2/3 w-full">
        <div className="flex justify-center">
          <input
            onChange={onFileChange}
            type="file"
            id="profile_pic_id"
            hidden
          />
          <div>
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={session.profile_pic} />
              </Avatar>
              <div className="absolute flex items-center gap-1 bottom-0 right-0 m-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className=" bg-main-dark-gray rounded-full p-1 cursor-pointer">
                    <Edit2Icon size={ICON_SIZE} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start">
                    <label htmlFor="profile_pic_id">
                      <DropdownMenuItem>
                        <UserOption
                          icon={<ImageDownIcon />}
                          label={"Choose an image"}
                        />
                      </DropdownMenuItem>
                    </label>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={deleteImage}>
                      <UserOption icon={<Trash2 />} label={"Delete image"} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-main-dark-gray px-4 py-2 rounded shadow-md w-full flex flex-col gap-2">
          <Tabs defaultValue="account">
            <TabsList className="bg-main-black w-full flex">
              <TabsTrigger value="account">Account</TabsTrigger>
              {session.provider === "email" ? (
                <TabsTrigger value="password">Password</TabsTrigger>
              ) : null}
            </TabsList>
            <TabsContent value="account">
              <AccountForm
                values={defaultValues}
                onSubmit={onFormAccountSubmit}
              />
            </TabsContent>
            {session.provider === "email" ? (
              <TabsContent value="password">
                <PasswordForm onSubmit={onFormPasswordSubmit} />
              </TabsContent>
            ) : null}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
