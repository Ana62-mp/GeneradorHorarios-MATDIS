import { Outlet } from "react-router";

import Navbar from "./Navbar";
import Footer from "./Footer";
import AppToastContainer from "../components/common/AppToastContainer";

function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />
      <AppToastContainer />
    </div>
  );
}

export default MainLayout;