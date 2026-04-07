import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { FolderPlus, FolderOpen, Folder, FolderCheck, Trash } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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
};

const Folders: React.FC<folderProps> = ({ folderToggle, setFolderToggle, setAddNote, setCurrentFolderName, folderSearchInput}) => {
  const { setCurrSelectedFolderId, setActiveView, mode, currSelectedFolderId} = useContext(UserContext);

  const navigate = useNavigate();
  const { folderId } = useParams();

  const [onChangeInput, setOnChangeInput] = useState<string | null>(null);
  const [folderData, setFolderData] = useState<folderDataType[]>([]);
  

  // Fetch folder's daata
  useEffect(() => {
    const dataFetcher = async () => {
      try {
        const response = await axios.get("https://nowted-server.remotestate.com/folders");

        if (response.data?.folders) {
          setFolderData(response.data.folders);
        }
      } catch (error) {
        console.error("Error fetching folders", error);
      }
    };
    dataFetcher();
  }, []);



  // Handling folder selection
  useEffect(() => {
    if (folderData.length === 0) return;

    const isFolderPage = location.pathname.startsWith("/folder");
    if (!isFolderPage) {
      return;
    }

    const matchedFolder = folderData.find((item) => item.id === folderId);
    const folderToSelect = matchedFolder || folderData[0];

    setCurrSelectedFolderId(folderToSelect.id);
    setCurrentFolderName(folderToSelect.name);
    setActiveView("folder");

    if (!matchedFolder) {
      navigate(`/folder/${folderToSelect.id}`, { replace: true });
    }
  }, [ folderId, folderData, location.pathname, navigate, setCurrSelectedFolderId, setCurrentFolderName, setActiveView]);


  const createFolder = async (changeInput: string) => {
    if (!changeInput.trim()){
      return;
    }

    try {
      await axios.post("https://nowted-server.remotestate.com/folders",{ name: changeInput });
      const response = await axios.get("https://nowted-server.remotestate.com/folders")


      if(response.data){
        setFolderData(response.data.folders);
      }

      setOnChangeInput("");
      setFolderToggle(false);
      
    } catch (err) {
      console.log(err);
    }
  };


  // Handling selected folder deletion
  
  const handleFolderDeletion = async () => {
    if (!currSelectedFolderId){
      return;
    }

    try {
      await axios.delete(
        `https://nowted-server.remotestate.com/folders/${currSelectedFolderId}`
      );
      setFolderData((prev: folderDataType[]) =>
        prev.filter((folder) => folder.id !== currSelectedFolderId)
      );
      setCurrSelectedFolderId(null);
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };



  useEffect(() => {
    const folder = folderData.find((item) => item.id === folderId);
    if (folder) {
      setCurrentFolderName(folder.name);
      setCurrSelectedFolderId(folder.id);
      setActiveView("folder");
    }
  }, [folderId, folderData]);

  const finalDataToShow =
    folderSearchInput.trim() === "" ? folderData : folderData.filter((item) => item.name?.toLowerCase().includes(folderSearchInput.toLowerCase()));
    
  return (
    <div onClick={() => setAddNote(false)} className="flex flex-col gap-2 w-75">
      <div className={`flex px-5 justify-between items-center ${ mode ? "text-[#FFFFFF99]" : "text-black"}`}>
        <h5 className=" text-sm">Folders</h5>
        <FolderPlus onClick={(e) => { e.stopPropagation(); setFolderToggle((prev) => !prev);}} className="h-5 w-5 cursor-pointer hover:text-white"/>
      </div>

      <div className="flex flex-col gap-2 w-full max-h-32.5 overflow-y-auto no-scrollbar scroll-smooth">
        <div onClick={(e) => e.stopPropagation()} className={` ${mode ? "hover:bg-[#FFFFFF08] text-[#FFFFFF99] hover:text-white" 
          : "hover:bg-gray-100 text-black hover:text-zinc-700" } h-10 shrink-0 w-full flex flex-row gap-3.75 items-center px-5 
          ${ folderToggle ? "flex" : "hidden"}`}>
          <FolderOpen className="h-5 w-5 shrink-0" />
          <input onChange={(e) => setOnChangeInput(e.target.value)} className={`bg-transparent outline-none text-sm h-5 w-full font-semibold
             ${ mode ? "text-white" : "text-black"}`} type="text" id="newFolderInput" placeholder="My New Folder"/>
          <FolderCheck onClick={() => { if (!onChangeInput) return; createFolder(onChangeInput); }} className="h-5 w-5 shrink-0"/>
        </div>

        {finalDataToShow.map((item) => (
          <div key={item.id}
               onClick={(e) => {
              e.stopPropagation();
              setCurrSelectedFolderId(item.id);
              setCurrentFolderName(item.name);
              setActiveView("folder");
              navigate(`/folder/${item.id}`);
            }}
            className={`h-10 shrink-0 w-full flex flex-row gap-3.75 items-center px-5 text-base cursor-pointer
            ${item.id === (folderId) ? mode ? "bg-[#FFFFFF1A] text-white" : "bg-gray-200 text-black" : mode ? "text-[#FFFFFF99]" 
            : "text-black"} ${mode ? "hover:bg-[#FFFFFF08] hover:text-white" : "hover:bg-gray-200 hover:text-black"}`}>
            {item.id === folderId ? ( <FolderOpen className="h-5 w-5 shrink-0" />) : (
              <Folder className="h-5 w-5 shrink-0" />
            )}
            <div className="flex flex-row justify-between items-center w-65 h-15">
              <h3>{item.name}</h3>
            <Trash onClick={handleFolderDeletion}  className="w-5 h-5"/>  
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Folders;
  


