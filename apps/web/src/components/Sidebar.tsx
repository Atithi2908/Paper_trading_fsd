import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function SideBar() {
  return (
    <div className="h-screen bg-panel text-ink transition-all duration-300 w-16 md:w-64 ease-in-out flex flex-col">
      <div className="mt-4 flex flex-col items-start px-4">
        {/* Hide "Menu" title when sidebar is small */}
        <h2 className="text-xl font-bold mb-8 hidden md:block">Menu</h2>

        <ul className="space-y-8">
          <li className="hover:text-primary cursor-pointer flex items-center space-x-2">
            <FaHome className="text-lg" />
            <span className="hidden md:inline">Home</span>
          </li>
          <li className="hover:text-primary cursor-pointer flex items-center space-x-2">
            <FaUser className="text-lg" />
            <span className="hidden md:inline">Profile</span>
          </li>
          <li className="hover:text-primary cursor-pointer  flex items-center space-x-2">
            <FaCog className="text-lg" />
            <span className="hidden md:inline">Settings</span>
          </li>
          <li className="hover:text-primary cursor-pointer  flex items-center space-x-2">
            <FaSignOutAlt className="text-lg" />
            <span className="hidden md:inline">Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
}