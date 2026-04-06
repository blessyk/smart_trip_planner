import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen min-w-0 w-full">
      {/* Header container should be full width and flex-shrink-0 */}
      <header className="flex-shrink-0 w-full"><Header/></header>

      <div className="flex flex-1 overflow-hidden min-w-0">
        <aside className="w-64 bg-[#0A3D62] text-white p-6">
         <Sidebar/>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-100 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}