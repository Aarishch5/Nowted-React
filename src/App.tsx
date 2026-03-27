import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Middle from "./components/Middle";
import Right from "./components/Right";
// import { UserContext } from "./context/UserContext";


const App: React.FC = () => {



  const [toggle, setToggle] = useState<boolean>(false);
  const [searchBtn, setSearchBtn] = useState<boolean>(true);

  const [folderToggle, setFolderToggle] = useState<boolean>(false);

  const [addNote, setAddNote] = useState<boolean>(false);

  
  
  return (
    <div onClick={() => {
      if (toggle) setToggle(false);
      if (!searchBtn) setSearchBtn(true);
      if(folderToggle) setFolderToggle(false)
    }} className="flex flex-row bg-[#121212] text-(--primary-font)">


      <Sidebar searchBtn={searchBtn} setSearchBtn={setSearchBtn} folderToggle={folderToggle} setFolderToggle={setFolderToggle} addNote={addNote} setAddNote={setAddNote}/>

      <Middle addNote={addNote} />

      <Right toggle={toggle} setToggle={setToggle} addNote={addNote} setAddNote={setAddNote}/>

    </div>
  );
};

export default App;

