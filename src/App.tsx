import React, { useContext } from "react";
import Sidebar from "./components/Sidebar";
import Middle from "./components/Middle";
import Right from "./components/Right";
import { UserContext } from "./context/UserContext";


const App: React.FC = () => {

  const { toggle, setToggle, searchBtn, setSearchBtn, folderToggle, setFolderToggle } = useContext(UserContext);

  
  return (
    <div onClick={() => {
      if (toggle) setToggle(false);
      if (!searchBtn) setSearchBtn(true);
      if(folderToggle) setFolderToggle(false)
    }} className="flex flex-row bg-[#121212]">


      <Sidebar />

      <Middle />

      <Right />

    </div>
  );
};

export default App;

