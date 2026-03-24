import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { FolderPlus, FolderOpen, Folder, FolderCheck } from "lucide-react";
import axios from "axios";

export type folderDataType = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

const Folders: React.FC = () => {
  const [folderData, setFolderData] = useState<folderDataType[]>([]);
  const { folderToggle, setFolderToggle, setSelectedFolderId, onChangeInput, setOnChangeInput } = useContext(UserContext);
  const { selectedFolderId, currSelectedFolderId ,setFolderInput } = useContext(UserContext);
  // const {onChangeInput, setOnChangeInput} = useState<string | null>("");

  useEffect(() => {
    const dataFetcher = async () => {
      try {
        const response = await axios.get(
          "https://nowted-server.remotestate.com/folders",
        );

        if (response.data && response.data.folders) {
          const folders = response.data.folders;

          setFolderData(folders);

          if (folders.length > 0) {
            setSelectedFolderId((prev) => prev ?? folders[0].id);
          }
        }
      } catch (error) {
        console.error("Error", error);
      }
    };

    dataFetcher();
  }, []);

  // console.log(folderInput);
  

  

  return (
    <div className="flex flex-col gap-2 w-75">
      <div className="flex px-5 justify-between items-center text-[#FFFFFF99]">
        <h5 className=" text-sm">Folders</h5>
        <FolderPlus
          onClick={(e) => {
            e.stopPropagation();
            setFolderToggle((prev) => !prev);
          }}
          className="h-5 w-5 hover:text-white cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-2 w-full max-h-32.5 overflow-y-auto no-scrollbar scroll-smooth">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`hover:bg-[#FFFFFF08] h-10 shrink-0 w-full flex flex-row gap-3.75 items-center px-5 text-[#FFFFFF99] hover:text-white ${folderToggle ? "flex" : "hidden"}`}
        >
          <FolderOpen className="h-5 w-5 shrink-0" />
          <input
            onChange={(e) => setOnChangeInput(e.target.value)}
            className="bg-transparent outline-none text-sm h-5 w-full font-semibold text-white"
            type="text"
            placeholder="My New Folder"
          />
          <FolderCheck onClick={() => setFolderInput(onChangeInput)} className="h-5 w-5 shrink-0"/>
        </div>

        {folderData.map((item) => (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFolderId(item.id);
            }}
            className={`hover:bg-[#FFFFFF08] ${item.id === selectedFolderId && item.id === currSelectedFolderId ? "bg-[#FFFFFF08] text-white" : ""} h-10 shrink-0 w-full flex flex-row gap-3.75 items-center px-5 text-base text-[#FFFFFF99] hover:text-white cursor-pointer`}
          >
            {item.id === selectedFolderId ? (
              <FolderOpen className="h-5 w-5 shrink-0" />
            ) : (
              <Folder className="h-5 w-5 shrink-0" />
            )}
            <h3>{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Folders;
