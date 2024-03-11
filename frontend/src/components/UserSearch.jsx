import React, { useEffect, useState } from "react";
import { Input } from "./ui/input.jsx";
import { Search } from "lucide-react";
import { toasty } from "@/lib/toasty.js";
import { axiosInstance } from "@/config/axiosInstance.js";
import { searchUser } from "@/config/api.js";

export default function UserSearch({ setSearchedUsers, setLoading }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function searchForUser() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          searchUser.replace(":user", query)
        );
        setSearchedUsers(response?.data?.users);
      } catch (error) {
        toasty("error", error);
      } finally {
        setLoading(false);
      }
    }
    if (query) searchForUser();
    else setSearchedUsers(null);
  }, [query]);
  return (
    <div>
      <Input
        type={"text"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={"Search for friends..."}
        className={"pl-8 pr-2"}
        domBefore={
          <div className="absolute mx-2 text-main-gray">
            <Search size={19} />
          </div>
        }
      />
    </div>
  );
}
