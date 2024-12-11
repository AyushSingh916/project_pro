"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserModal from "./modal";
import NotificationModal from "./notifications";
import { Bell } from "lucide-react"; // Example icon library

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const handleUserModalToggle = () => setIsUserModalOpen(!isUserModalOpen);
  const handleUserModalClose = () => setIsUserModalOpen(false);

  const handleNotificationModalToggle = () =>
    setIsNotificationModalOpen(!isNotificationModalOpen);
  const handleNotificationModalClose = () => setIsNotificationModalOpen(false);

  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex justify-between items-center text-white ">
        <Link href="/">
          <h1 className="text-2xl font-bold">
            <Image
              src={"/logo.svg"}
              alt="Zscrum Logo"
              width={300}
              height={84}
              className="h-14 w-auto object-contain"
            />
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {session && (
            <>
              <button
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-300"
                onClick={handleUserModalToggle}
              >
                <Image
                  src={session.user?.image || "/default-avatar.svg"}
                  alt="User Avatar"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </button>
              <button
                className="w-10 h-10 rounded-full flex justify-center items-center bg-gray-800 hover:bg-gray-700"
                onClick={handleNotificationModalToggle}
              >
                <Bell className="w-6 h-6 text-white" />
              </button>
              <UserModal
                user={session.user}
                isOpen={isUserModalOpen}
                onClose={handleUserModalClose}
                onSignOut={signOut}
              />
              <NotificationModal
                isOpen={isNotificationModalOpen}
                onClose={handleNotificationModalClose}
                notifications={[
                  { id: 1, message: "You have a new task assigned." },
                  { id: 2, message: "Meeting scheduled for tomorrow." },
                  { id: 3, message: "Project deadline extended by 2 days." },
                ]}
              />
            </>
          )}
          {!session && (
            <>
              <Button onClick={() => router.push("/signin")}>Sign In</Button>
              <Button onClick={() => router.push("/signup")}>Sign Up</Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
