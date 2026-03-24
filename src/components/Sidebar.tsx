import React from "react";
import logo from "../assets/logo.svg";
import {
  Search,
  Plus,
} from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Folders from "./Folders";
import More from "./More";
import Recents from "./Recents";

const Sidebar: React.FC = () => {
  const { searchBtn, setSearchBtn } = useContext(UserContext);

  return (
    <div className="flex flex-col h-screen w-[300px] bg-[#181818] py-[30px] gap-[30px]">
      {/* Top - Logo and Search */}
      <div className="w-[300px] flex px-[20px]">
        <div className="flex flex-row justify-between items-center w-full">
          <img className="h-[38px] w-[101px]" src={logo} alt="" />
          <Search onClick={(e) => {
              e.stopPropagation();
              setSearchBtn((prev) => !prev);
            }} className="h-[20px] w-[20px] cursor-pointer text-[#FFFFFF]" />
        </div>
      </div>

      {/* New Note btn */}

      <div className=" flex pl-[20px] w-[300px]">
        {searchBtn ? (
          <div
            className="flex flex-row gap-[8px] justify-center items-center bg-[#FFFFFF0D] w-[260px] h-[40px] cursor-pointer"
          >
            <Plus className="h-[20px] w-[20px] text-white" />
            <h1 className="font-semibold text-white text-base">New Note</h1>
          </div>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-row gap-[8px] p-[10px] justify-start items-center bg-[#FFFFFF0D] w-[260px] h-[40px] cursor-pointer"
          >
            <Search className="h-[20px] text-[#FFFFFF99] w-[20px]" />
            <input
              className=" font-semibold text-[#FFFFFF99] text-base outline-none"
              type="text"
              placeholder="Search note"
            />
          </div>
        )}
      </div>

      {/* Recents */}
      <Recents/>

      {/* Folders */}
      <Folders/>

      {/* More */}
        <More />
    </div>
  );
};

export default Sidebar;
