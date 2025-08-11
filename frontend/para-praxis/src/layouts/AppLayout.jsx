import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--surface-2)]">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          backgroundColor: "#ffffff",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
        }}
      />
    </div>
  );
}
