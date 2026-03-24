import React from "react";
import logo from "../assets/logo.svg";
import { Search, Plus } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Folders from "./Folders";
import More from "./More";
import Recents from "./Recents";

const Sidebar: React.FC = () => {
  const { searchBtn, setSearchBtn } = useContext(UserContext);

  return (
    <div className="flex flex-col h-screen w-75 bg-[#181818] py-7.5 gap-7.5">
      {/* Top - Logo and Search */}
      <div className="w-75 flex px-5">
        <div className="flex flex-row justify-between items-center w-full">
          <img className="h-9.5 w-25.25" src={logo} alt="" />
          <Search
            onClick={(e) => {
              e.stopPropagation();
              setSearchBtn((prev) => !prev);
            }}
            className="h-5 w-5 cursor-pointer text-[#FFFFFF]"
          />
        </div>
      </div>

      {/* New Note btn */}

      <div className=" flex pl-5 w-75">
        {searchBtn ? (
          <div className="flex flex-row gap-2 justify-center items-center bg-[#FFFFFF0D] w-65 h-10 cursor-pointer">
            <Plus className="h-5 w-5 text-white" />
            <h1 className="font-semibold text-white text-base">New Note</h1>
          </div>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-row gap-2 p-2.5 justify-start items-center bg-[#FFFFFF0D] w-65 h-10 cursor-pointer"
          >
            <Search className="h-5 text-[#FFFFFF99] w-5" />
            <input
              className=" font-semibold text-[#FFFFFF99] text-base outline-none"
              type="text"
              placeholder="Search note"
            />
          </div>
        )}
      </div>

      {/* Recents */}
      <Recents />

      {/* Folders */}
      <Folders />

      {/* More */}
      <More />
    </div>
  );
};

export default Sidebar;
