import shrimpImage from "../images/shrimp.png";
import Topbar from "./topbar";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <div className="flex flex-col min-w-2/13 bg-white items-center h-screen p-5 gap-7">
        <Link href="/" className="w-full flex justify-center">
          <div className="flex flex-row gap-2 items-center">
            <img className="size-14" src={shrimpImage.src} alt="shrimp logo" />
            <div className="font-bold text-left leading-none text-xl">
              <div>Go</div>
              <div>Shrimp</div>
            </div>
          </div>
        </Link>
        <div className="flex flex-col w-full items-center gap-5 text-base">
          <Link href="/" className="w-full flex justify-center">
            <div className="rounded-4xl hover:outline px-5 py-2 w-10/12 flex items-center gap-2">
              <span className="material-symbols-outlined">space_dashboard</span>
              <span>Dashboard</span>
            </div>
          </Link>

          <Link href="/analytics" className="w-full flex justify-center">
            <div className="rounded-4xl hover:outline px-5 py-2 w-10/12 flex items-center gap-2">
              <span className="material-symbols-outlined">browse_activity</span>
              <span>Analytics</span>
            </div>
          </Link>

          <Link href="/database" className="w-full flex justify-center">
            <div className="rounded-4xl hover:outline px-5 py-2 w-10/12 flex items-center gap-2">
              <span className="material-symbols-outlined">database</span>
              <span>Database</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
