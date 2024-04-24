import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Manager from "../Manager/Manager";
import { Wrapper } from "../../game-components/GamePage.styled";
import GamePage from "../../game-components/GamePage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Wrapper></Wrapper>} />
        <Route path="/table" element={<GamePage />} />
      </Routes>
      <ToastContainer />
      <Manager />
    </>
  );
};

export default App;
