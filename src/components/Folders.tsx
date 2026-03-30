import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { FolderPlus, FolderOpen, Folder, FolderCheck } from "lucide-react";
import axios from "axios";

export type folderDataType = {
  id: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type folderProps = {
  folderToggle: boolean;
  setFolderToggle: React.Dispatch<React.SetStateAction<boolean>>;

  addNote: boolean;
  setAddNote: React.Dispatch<React.SetStateAction<boolean>>;

  currFolderName: string | null;
  setCurrentFolderName: React.Dispatch<React.SetStateAction<string | null>>;

  folderSearchInput: string;
}

const Folders: React.FC<folderProps> = ({folderToggle, setFolderToggle, setAddNote, setCurrentFolderName, folderSearchInput}) => {

  
  const { currSelectedFolderId, setCurrSelectedFolderId, setActiveView} = useContext(UserContext);

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const [onChangeInput, setOnChangeInput] = useState<string | null>(null);

  const [folderData, setFolderData] = useState<folderDataType[]>([]);

  const { setFolderDataName} = useContext(UserContext);

  useEffect(() => {
    const dataFetcher = async () => {
      try {
        const response = await axios.get(
          "https://nowted-server.remotestate.com/folders"
        );

        if (response.data && response.data.folders) {
          const folders = response.data.folders;
          setFolderData(folders);

          if (folders.length > 0) {
            const firstFolder = folders[0];
            setSelectedFolderId(firstFolder.id);
            setCurrSelectedFolderId(firstFolder.id);
            setCurrentFolderName(firstFolder.name);
            setActiveView("folder"); 
          }
        }
      } catch (error) {
        console.error("Error fetching folders", error);
      }
    };

    dataFetcher();
  }, []);

  // new Folder Createing
  const createFolder = async (changeInput: string) => {
    if (!changeInput.trim()) return;

    try {
      const response = await axios.post("https://nowted-server.remotestate.com/folders",
        { name: changeInput }
      );

      const newFolder = response.data;
      setFolderData((prev) => [...prev, newFolder]);
      setFolderDataName("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const folder = folderData.find((item) => item.id === currSelectedFolderId);
    if (folder) setCurrentFolderName(folder.name);
  }, [currSelectedFolderId, folderData]);

  const filteredFolders =
  folderSearchInput.trim() === ""
    ? folderData
    : folderData.filter((item) =>
        item.name?.toLowerCase().includes(folderSearchInput.toLowerCase())
      );
 
  return (
    <div onClick={() => setAddNote(false)} className="flex flex-col gap-2 w-75">
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
        {/* Input for new folder */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`hover:bg-[#FFFFFF08] h-10 shrink-0 w-full flex flex-row gap-3.75 items-center px-5 text-[#FFFFFF99] hover:text-white ${
            folderToggle ? "flex" : "hidden"
          }`}
        >
          <FolderOpen className="h-5 w-5 shrink-0" />
          <input
            onChange={(e) => setOnChangeInput(e.target.value)}
            className="bg-transparent outline-none text-sm h-5 w-full font-semibold text-white"
            type="text"
            id="newFolderInput"
            placeholder="My New Folder"
          />
          <FolderCheck
            onClick={() => {
              if (!onChangeInput) return;
              createFolder(onChangeInput);
            }}
            className="h-5 w-5 shrink-0"
          />
        </div>

        {filteredFolders.map((item) => (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFolderId(item.id);
              setCurrSelectedFolderId(item.id);
              setCurrentFolderName(item.name); 
              setActiveView("folder");
            }}
            className={`hover:bg-[#FFFFFF08] ${item.id === selectedFolderId && item.id === currSelectedFolderId ? "bg-[#FFFFFF08] text-white" : ""}
             h-10 shrink-0 w-full flex flex-row gap-3.75 items-center px-5 text-base text-[#FFFFFF99] hover:text-white cursor-pointer`}>
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