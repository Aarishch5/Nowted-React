import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { FolderPlus, FolderOpen, Folder, FolderCheck, Trash, Pencil} from "lucide-react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
};

const Folders: React.FC<folderProps> = ({folderToggle,setFolderToggle,setAddNote,setCurrentFolderName}) => {
  const { setCurrSelectedFolderId, setActiveView, mode, currSelectedFolderId } =
    useContext(UserContext);

  const navigate = useNavigate();
  const { folderId } = useParams();

  const [onChangeInput, setOnChangeInput] = useState<string>("");
  const [finalFolderNameInput, setFinalFolderNameInput] = useState<string>("");

  const { folderData, setFolderData } = useContext(UserContext);

  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editedFolderName, setEditedFolderName] = useState("");

  // Fetch folder's daata
  useEffect(() => {
    const folderFetcher = async () => {
      try {
        const response = await api.get("/folders");

        if (response.data?.folders) {
          setFolderData(response.data.folders);
        }
      } catch (error) {
        console.error("Error in fetching folders", error);
      }
    };
    folderFetcher();
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

  // Folder Create
  const createFolder = async (changeInput: string) => {
    if (!changeInput.trim()) {
      return;
    }

    try {
      await api.post("/folders", { name: changeInput });

      const response = await api.get("/folders");

      if (response.data) {
        setFolderData(response.data.folders);
      }

      setOnChangeInput("");
      setFolderToggle(false);
      toast.success("Folder created successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  // Handling selected folder deletion
  const handleFolderDeletion = async (
    e: React.MouseEvent,
    folderIdToDelete: string,
  ) => {
    e.stopPropagation();
    if (!folderId) {
      return;
    }

    try {
      await api.delete(`/folders/${folderIdToDelete}`);

      // Fetching folders again
      const response = await api.get("/folders");
      if (response.data?.folders) {
        setFolderData(response.data.folders);
      }

      if (currSelectedFolderId === folderIdToDelete) {
        setCurrSelectedFolderId(null);
        setCurrentFolderName(null);
        navigate("/");
      }
      
      toast.warning("Folder Deleted!");

    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  //  debouncing on the folder naming inout

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFinalFolderNameInput(onChangeInput);
    }, 500);

    return () => clearTimeout(timeOut);
  }, [onChangeInput]);

  //  Handling the folder renaminng

  const handleFolderRename = async (folderIdToEdit: string) => {
    if (!editedFolderName.trim()) return;

    try {
      await api.patch(`/folders/${folderIdToEdit}`, {
        name: editedFolderName,
      });

      const response = await api.get("/folders");
      if (response.data?.folders) {
        setFolderData(response.data.folders);
      }

      if (folderIdToEdit === currSelectedFolderId) {
        setCurrentFolderName(editedFolderName);
      }

      setEditingFolderId(null);
      setEditedFolderName("");
    } catch (error) {
      console.error("Error renaming folder:", error);
    }
  };

  return (
    <div onClick={() => setAddNote(false)} className="flex flex-col gap-2 w-75">
      <div className="flex px-5 justify-between items-center text-(--folderTextColor)">
        <h5 className=" text-sm">Folders</h5>
        <FolderPlus
          onClick={(e) => {
            e.stopPropagation();
            setFolderToggle((prev) => !prev);
          }}
          className={`h-5 w-5 cursor-pointer ${mode ? "hover:text-white" : ""}`}
        />
      </div>

      <div className="flex flex-col gap-1.5 w-full max-h-35 overflow-y-auto no-scrollbar scroll-smooth">
        <div
          onClick={(e) => e.stopPropagation()}
          className={`hover:bg-(--folderHoverBg) text-(--folderTextColor) hover:text-(--hoverTextColor) h-10 shrink-0 w-full flex flex-row gap-3.75 items-center px-5 
          ${folderToggle ? "flex" : "hidden"}`}
        >
          <FolderOpen className="h-5 w-5 shrink-0" />
          <input
            onChange={(e) => setOnChangeInput(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (!finalFolderNameInput.trim()) return;
                  createFolder(finalFolderNameInput);
                }
            }}
            className="bg-transparent outline-none text-sm h-5 w-full font-semibold
             text-(--mainText)"
            type="text"
            id="newFolderInput"
            placeholder="My New Folder"
          />
          <FolderCheck onClick={() => {
              if (!finalFolderNameInput.trim()) return;
              createFolder(finalFolderNameInput);
            }} className="h-5 w-5 shrink-0 cursor-pointer"/>
        </div>

        {folderData.map((item) => (
          <div key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setActiveView("folder");
              navigate(`/folder/${item.id}`);
            }}
            className={`h-10 shrink-0 w-full flex flex-row gap-3.75 items-center px-5 text-base cursor-pointer
            ${item.id === folderId ? "text-[var(--mainText)] bg-[var(--folderBg)]" : "text-[var(--folderTextColor)]"} 
            hover:bg-[var(--folderHoverBg2)] hover:text-[var(--mainText)]`}
          >
            {item.id === folderId ? (
              <FolderOpen className="h-5 w-5 shrink-0" />
            ) : (
              <Folder className="h-5 w-5 shrink-0" />
            )}
            <div className="flex flex-row justify-between items-center w-65 h-15">
              {editingFolderId === item.id ? (
                <input name={editedFolderName}
                  value={editedFolderName}
                  onChange={(e) => setEditedFolderName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={() => handleFolderRename(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFolderRename(item.id);
                    }
                  }}
                  className="bg-transparent outline-none border-b border-[var(--mainText)] text-[var(--mainText)] w-full text-sm font-semibold"
                  
                />
              ) : (
                <h3>{item.name}</h3>
              )}

              <div className="flex flex-row gap-4 shrink-0">
                {/* <Pencil className="w-5 h-5" /> */}
                <Pencil
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFolderId(item.id);
                    setEditedFolderName(item.name ?? "");
                  }}
                  className="w-5 h-5 cursor-pointer"
                />
                <Trash
                  onClick={(e) => handleFolderDeletion(e, item.id)}
                  className="w-5 h-5 cursor-pointer"
                />{" "}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Folders;
