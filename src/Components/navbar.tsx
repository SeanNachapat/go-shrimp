import shrimpImage from "../images/shrimp.png";
import Topbar from "./topbar";

export default function Navbar() {
  return (
    <>
      <div className="flex flex-col min-w-2/13 bg-white items-center h-screen p-5 gap-7">
        <button>
          <div className="flex flex-row gap-2 items-center">
            <img className="size-14" src={shrimpImage.src} alt="shrimp logo" />
            <div className="font-bold text-left leading-none text-xl">
              <div>Go</div>
              <div>Shrimp</div>
            </div>
          </div>
        </button>
        <div className="flex flex-col w-full items-center gap-5 text-base">
          <button className="rounded-4xl hover:bg-gray-400 px-5 py-2 w-10/12 flex items-center gap-2">
            <span className="material-symbols-outlined">space_dashboard</span>
            <span>Dashboard</span>
          </button>

          <button className="rounded-4xl hover:bg-gray-400 px-5 py-2 w-10/12 flex items-center gap-2">
            <span className="material-symbols-outlined">browse_activity</span>
            <span>Analytics</span>
          </button>

          <button className="rounded-4xl hover:bg-gray-400 px-5 py-2 w-10/12 flex items-center gap-2">
            <span className="material-symbols-outlined">database</span>
            <span>Database</span>
          </button>
        </div>
      </div>
    </>
  );
}
