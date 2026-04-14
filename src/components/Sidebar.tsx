import React, { useContext, useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import { Search, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import Folders from "./Folders";
import More from "./More";
import Recents from "./Recents";
import { UserContext } from "../context/UserContext";
import { type recentData } from "./Recents";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

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

  searchedNotes: recentData[];
  setSearchedNotes: React.Dispatch<React.SetStateAction<recentData[]>>;
  showSearchDropdown: boolean;
  setShowSearchDropdown: React.Dispatch<React.SetStateAction<boolean>>;

  

};

const Sidebar: React.FC<SidebarPropType> = ({
  searchBtn,
  setSearchBtn,
  folderToggle,
  setFolderToggle,
  addNote,
  setAddNote,
  currFolderName,
  setCurrentFolderName,
  setNoteSearchInput,
  searchedNotes,
  setSearchedNotes,
  showSearchDropdown,
  setShowSearchDropdown,

}) => {
  const { mode, setMode } = useContext(UserContext);

  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const trimmedValue = inputValue.trim();
      setNoteSearchInput(trimmedValue);

      if (trimmedValue === "") {
        setSearchedNotes([]);
        setShowSearchDropdown(false);
        return;
      }

      try {
        const response = await api.get("/notes?limit=200");

        const allNotes: recentData[] = response.data.notes || [];

        const matchedNotes = allNotes.filter((note) => {
          const titleMatch = note.title
            ?.toLowerCase()
            .includes(trimmedValue.toLowerCase());
          return !note.deletedAt && titleMatch;
        });

        setSearchedNotes(matchedNotes);
        setShowSearchDropdown(true);
      } catch (error) {
        console.error("Search API error:", error);
        setSearchedNotes([]);
        setShowSearchDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, setNoteSearchInput, setSearchedNotes, setShowSearchDropdown]);

  const handleSearchClick = (note: recentData) => {
    setShowSearchDropdown(false);
    setInputValue("");
    setSearchBtn(true);

    if (note.folderId) {
      navigate(`/folder/${note.folderId}/note/${note.id}`);
    }
  };

  return (
    <div className="flex flex-col h-screen w-75 bg-(--sidebarBg) py-7.5 gap-7.5">
      <div className="w-75 flex px-5">
        <div className="flex flex-row justify-between items-center w-full">
          <img
            className={`h-9.5 w-25.25 ${!mode ? "filter invert sepia hue-rotate-200 saturate-500" : ""}`}
            src={logo}
            alt=""
          />
          <div className="flex flex-row items-center gap-6">
            {mode ? (
              <ToggleLeft
                onClick={() => setMode(!mode)}
                className="h-7 w-12 cursor-pointer text-[#FFFFFF] shrink-0 stroke-1.5"
              />
            ) : (
              <ToggleRight
                onClick={() => setMode(!mode)}
                className="h-7 w-12 cursor-pointer text-black shrink-0 stroke-1.5"
              />
            )}
            <Search
              onClick={(e) => {
                e.stopPropagation();
                setSearchBtn((prev) => !prev);
                setShowSearchDropdown(false);
              }}
              className="h-5 w-5 cursor-pointer text-(--mainText)"
            />
          </div>
        </div>
      </div>

      <div className="flex pl-5 w-75">
        {searchBtn ? (
          <div
            onClick={() => {
              setAddNote(true);
            }}
            className="flex flex-row gap-2 justify-center items-center bg-(--sidebarBtnBg) w-65 h-10 cursor-pointer"
          >
            <Plus className="h-5 w-5 text-(--mainText)" />
            <h1 className="font-semibold text-(--mainText)  text-base">
              New Note
            </h1>
          </div>
        ) : (
          <div className="relative w-65" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-row gap-2 p-2.5 justify-start items-center bg-(--searchBtnBg) h-10 cursor-pointer ">
              <Search className="h-5 text-(--mainText) w-5" />
              <input
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                id="searchNote"
                className="font-semibold text-(--mainText) text-base outline-none w-full"
                type="text"
                placeholder="Search note"
              />
            </div>

            {showSearchDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-12 left-0 w-full max-h-80 overflow-y-auto no-scrollbar rounded-md bg-(--sidebarBg) border border-white/10 shadow-xl z-50"
              >
                {searchedNotes.length > 0 ? (
                  searchedNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => handleSearchClick(note)}
                      className="px-4 py-3 cursor-pointer hover:bg-(--folderHoverBg2) border-b border-white/5"
                    >
                      <h3 className="text-sm font-semibold text-(--mainText)">
                        {" "}
                        {note.title}
                      </h3>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-(--middleText)">
                    Note not found
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <Recents/>

      <Folders
        folderToggle={folderToggle}
        setFolderToggle={setFolderToggle}
        addNote={addNote}
        setAddNote={setAddNote}
        currFolderName={currFolderName}
        setCurrentFolderName={setCurrentFolderName}
      />

      <More />
    </div>
  );
};

export default Sidebar;
