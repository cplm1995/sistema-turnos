import "./App.css";
import Router from "./routes/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <>
      <div className="container">
        <Router />
         <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </>
  );
}

export default App;
