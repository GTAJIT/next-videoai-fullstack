"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, Video, Upload, LogOut} from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="bg-base-300 shadow-lg sticky w-screen top-0 z-40">
      <nav className="container w-full mx-auto navbar flex px-4 py-2">
        {/* Logo Section */}
        <div className="flex flex-0/3 justify-between items-center">
          <Link
            href="/"
            className="btn btn-ghost flex gap-2 text-xl font-bold hover:bg-base-200"
          >
            <Video className="w-6 h-6 text-primary" />
            <span className="hidden md:inline">VideoAI Pro</span>
          </Link>
        </div>

          {/* User Menu */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle hidden  avatar"
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="rounded-full"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            
            <ul className="dropdown-content flex gap-5 z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-72 mt-4">
              {session ? (
                <>
                  <li className="menu-title">
                    <span className="text-sm font-medium">
                      {session.user?.name || session.user?.email?.split("@")[0]}
                    </span>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <Link href="/video" className="flex items-center gap-3">
                      <Home className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/upload" className="flex items-center gap-3">
                      <Upload className="w-4 h-4" />
                      Upload Video
                    </Link>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="text-error cursor-pointer hover:scale-105 flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="btn btn-primary btn-sm w-full"
                    onClick={() => showNotification("Please sign in to continue", "info")}
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
      </nav>
    </header>
  );
}