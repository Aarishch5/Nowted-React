import React, { useContext } from "react";
import { Star, Trash, Archive } from "lucide-react";
import { UserContext } from "../context/UserContext";

const More: React.FC = () => {
  const { setCurrSelectedFolderId, setActiveView } = useContext(UserContext);

  const handleClick = (view: "favorites" | "archived" | "trash") => {
    setCurrSelectedFolderId(null); 
    setActiveView(view); 
  };


  return (
    <div className="flex flex-col gap-2 w-75">
      <div className="flex px-5 justify-between items-center">
        <h5 className="text-[#FFFFFF99] text-sm">More</h5>
      </div>
      <div className="flex flex-col gap-1.25 w-full cursor-pointer">
        <div
          onClick={() => handleClick("favorites")}
          className="hover:bg-[#FFFFFF08] h-10 w-full flex flex-row gap-3.75 items-center px-5 text-[#FFFFFF99] hover:text-white"
        >
          <Star className="h-5 w-5" />
          <h3 className="text-base">Favourites</h3>
        </div>
        <div
          onClick={() => handleClick("trash")}
          className="cursor-pointer group h-10 w-full flex flex-row gap-3.75 items-center px-5 text-[#FFFFFF99] hover:bg-[#FFFFFF08] hover:text-white text-base"
        >
          <Trash className="h-5 w-5 text-[#FFFFFF99] group-hover:text-white transition" />
          <h3>Trash</h3>
        </div>
        <div
          onClick={() => handleClick("archived")}
          className="cursor-pointer h-10 w-full flex flex-row gap-3.75 items-center px-5 hover:bg-[#FFFFFF08] text-base text-[#FFFFFF99] hover:text-white"
        >
          <Archive className="h-5 w-5" />
          <h3 className="">Archived</h3>
        </div>
      </div>
    </div>
  );
};

export default More;