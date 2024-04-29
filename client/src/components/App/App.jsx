import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Manager from "../Manager/Manager";
import { Wrapper } from "../../game-components/GamePage.styled";
import GamePage from "../../game-components/GamePage";
import Home from "../../auth-components/Home";
import Signup from "../../auth-components/Signup";
import Login from "../../auth-components/Login";
import ForgotPassword from "../../auth-components/ForgotPassword";
import ResetPassword from "../../auth-components/ResetPassword";

const App = () => {
  return (
    <Wrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Manager />} />
        <Route
          path="/table"
          element={
            <>
              <GamePage /> <Manager />
            </>
          }
        />
      </Routes>
      <ToastContainer />
      {/* <Manager /> */}
    </Wrapper>
  );
};

export default App;
