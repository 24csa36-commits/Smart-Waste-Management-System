import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx"


const Router = () => {
  return (
    <div>
        <Routes>
            <Route exact path="/" element={<Login/>} />
            <Route exact path="/login" element={<Signup/>}/>
        </Routes>

    </div>
  )
}

export default Router