import React, { useContext, useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import { Search, Plus, ToggleLeft, ToggleRight } from "lucide-react"
import Folders from "./Folders";
import More from "./More";
import Recents from "./Recents";
import { UserContext } from "../context/UserContext";

type SidebarPropType = {
  searchBtn: boolean;
  setSearchBtn: React.Dispatch<React.SetStateAction<boolean>>;

  folderToggle: boolean;
  setFolderToggle: React.Dispatch<React.SetStateAction<boolean>>;

  addNote: boolean;
  setAddNote: React.Dispatch<React.SetStateAction<boolean>>;

  currFolderName: string | null;
  setCurrentFolderName: React.Dispatch<React.SetStateAction<string | null>>;

  setNoteSearchInput: React.Dispatch<React.SetStateAction<string>>;
};

const Sidebar: React.FC<SidebarPropType> = ({ searchBtn, setSearchBtn, folderToggle, setFolderToggle, addNote, setAddNote, currFolderName, setCurrentFolderName,setNoteSearchInput}) => {
  const { mode, setMode } = useContext(UserContext);

  const [inputValue, setInputValue] = useState("");
  


  // Debouncing on the Searching fnality

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim() === "") {
        setNoteSearchInput("");
      } else {
        setNoteSearchInput(inputValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);


  return (
    <div className={`flex flex-col h-screen w-75 ${ mode ? "bg-[#181818]" : "bg-white"} py-7.5 gap-7.5`}>
      <div className="w-75 flex px-5">
        <div className="flex flex-row justify-between items-center w-full">
          <img className={`h-9.5 w-25.25 ${ !mode ? "filter invert sepia hue-rotate-200 saturate-500" : ""}`} src={logo} alt=""/>
          <div className="flex flex-row items-center gap-6">
            {mode ? (
              <ToggleLeft onClick={() => setMode(!mode)} className="h-7 w-12 cursor-pointer text-[#FFFFFF] shrink-0 stroke-1.5"/>
            ) : (
              <ToggleRight onClick={() => setMode(!mode)} className="h-7 w-12 cursor-pointer text-black shrink-0 stroke-1.5"/>
            )}
            <Search onClick={(e) => {
                e.stopPropagation();
                setSearchBtn((prev) => !prev);
              }} className={`h-5 w-5 cursor-pointer ${ mode ? "text-[#FFFFFF]" : "text-black"}`}/>
          </div>
        </div>
      </div>

      <div className="flex pl-5 w-75">
        {searchBtn ? (
          <div onClick={() => setAddNote(true)}
            className={`flex flex-row gap-2 justify-center items-center ${ mode ? "bg-[#FFFFFF0D] " : "bg-gray-200"} w-65 h-10 cursor-pointer`}>
            <Plus className={`h-5 w-5 ${mode ? "text-white" : "text-black"}`} />
            <h1 className={`font-semibold ${ mode ? "text-white" : "text-black"} text-base`}>New Note</h1>
          </div>
        ) : (
          <div onClick={(e) => e.stopPropagation()}
            className={`flex flex-row gap-2 p-2.5 justify-start items-center ${ mode ? "bg-[#FFFFFF0D]" : "bg-white"} w-65 h-10 cursor-pointer`}>
            <Search className={`h-5 ${mode ? "text-white" : "text-black"} w-5`}/>
            <input onChange={(e) => { setInputValue(e.target.value);}} id="searchNote"
            // <input id="searchNote"

              className={`font-semibold ${ mode ? "text-white" : "text-black"} text-base outline-none`} type="text" placeholder="Search note"/>
          </div>
        )}
      </div>

      <Recents />

      <Folders folderToggle={folderToggle} setFolderToggle={setFolderToggle} addNote={addNote} setAddNote={setAddNote} currFolderName={currFolderName} setCurrentFolderName={setCurrentFolderName}/>

      <More />
    </div>
  );
};

export default Sidebar;