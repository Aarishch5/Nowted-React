import React, { useContext } from "react";
import { Star, Trash, Archive } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";


type viewType =  "favorites" | "archived" | "trash";


const More: React.FC = () => {
  const { setCurrSelectedFolderId, setActiveView, mode } = useContext(UserContext);

  const navigate = useNavigate();
  const location = useLocation(); 
  
  const handleClick = (view: viewType) => {
    setCurrSelectedFolderId(null);   
    setActiveView(view);
    navigate(`/${view}`);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col gap-2 w-75 text-black">
      <div className="flex px-5 justify-between items-center">
        <h5 className={` text-sm ${mode ? "text-[#FFFFFF99]" : "text-black"}`}> More </h5>
      </div>

      <div className="flex flex-col gap-1.25 w-full cursor-pointer">
        <div onClick={() => handleClick("favorites")}
          className={`h-10 w-full flex flex-row gap-3.75 items-center px-5 ${isActive("/favorites") ? mode ? "bg-[#FFFFFF1A] text-white"
                : "bg-gray-200 text-black" : mode ? "text-[#FFFFFF99] hover:text-white hover:bg-[#FFFFFF08]" : "text-black hover:bg-gray-200"}`}>
          <Star className="h-5 w-5" />
          <h3 className="text-base">Favourites</h3>
        </div>

        <div onClick={() => handleClick("trash")}
          className={`cursor-pointer group h-10 w-full flex flex-row gap-3.75 items-center px-5 ${ isActive("/trash") ? mode ? "bg-[#FFFFFF1A] text-white"
                : "bg-gray-200 text-black" : mode ? "text-[#FFFFFF99] hover:text-white hover:bg-[#FFFFFF08]" : "text-black hover:bg-gray-200"
          } text-base`}>
          <Trash className="h-5 w-5" />
          <h3>Trash</h3>
        </div>

        <div onClick={() => handleClick("archived")}
          className={`cursor-pointer h-10 w-full flex flex-row gap-3.75 items-center px-5 ${ isActive("/archived") ? mode ? "bg-[#FFFFFF1A] text-white" : "bg-gray-200 text-black"
              : mode ? "text-[#FFFFFF99] hover:text-white hover:bg-[#FFFFFF08]" : "text-black hover:bg-gray-200"} text-base`}>
          <Archive className="h-5 w-5" />
          <h3 className="">Archived</h3>
        </div>
      </div>
    </div>
  );
};

export default More;