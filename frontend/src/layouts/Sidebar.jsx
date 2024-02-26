import UserOptions from "@/components/userOptions.jsx";
import Logo from "/chatvibe.png";
import UserSearch from "@/components/UserSearch.jsx";

export default function Sidebar() {
  return (
    <div className=" w-full  h-full bg-main-black p-5 flex flex-col gap-3">
      <div>
        <UserOptions />
      </div>
      <div className="h-full">
        <UserSearch />
      </div>
    </div>
  );
}
