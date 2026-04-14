import React, { useContext } from "react";
import { Star, Trash, Archive } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";

type viewType = "favorites" | "archived" | "trash";

const More: React.FC = () => {
  const { setCurrSelectedFolderId, setActiveView } = useContext(UserContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (view: viewType) => {
    setCurrSelectedFolderId(null);
    setActiveView(view);
    navigate(`/${view}`);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col gap-2 w-75">
      <div className="flex px-5 justify-between items-center">
        <h5 className="text-sm text-(--folderTextColor)"> More </h5>
      </div>

      <div className="flex flex-col gap-1.25 w-full cursor-pointer">
        <div
          onClick={() => handleClick("favorites")}
          className={`h-10 w-full flex flex-row gap-3.75 items-center px-5 ${
            isActive("/favorites")
              ? "bg-(--folderBg) text-(--mainText)"
              : "text-(--folderTextColor) hover:bg-(--folderHoverBg2) hover:text-(--moreHoverBg)"
          }`}
        >
          <Star className="h-5 w-5" />
          <h3 className="text-base">Favourites</h3>
        </div>

        <div
          onClick={() => handleClick("trash")}
          className={`cursor-pointer group h-10 w-full flex flex-row gap-3.75 items-center px-5 ${
            isActive("/trash")
              ? "bg-(--folderBg) text-(--mainText)"
              : "text-(--folderTextColor) hover:bg-(--folderHoverBg2) hover:text-(--moreHoverBg)"
          } text-base`}
        >
          <Trash className="h-5 w-5" />
          <h3>Trash</h3>
        </div>

        <div
          onClick={() => handleClick("archived")}
          className={`cursor-pointer h-10 w-full flex flex-row gap-3.75 items-center px-5 ${
            isActive("/archived")
              ? "bg-(--folderBg) text-(--mainText)"
              : "text-(--folderTextColor) hover:bg-(--folderHoverBg2) hover:text-(--moreHoverBg)"
          } text-base`}
        >
          <Archive className="h-5 w-5" />
          <h3>Archived</h3>
        </div>
      </div>
    </div>
  );
};

export default More;
