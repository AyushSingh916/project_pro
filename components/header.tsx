"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import UserModal from "./Modals/modal";
import NotificationModal from "./notifications";
import { Bell, BellRing } from "lucide-react";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const username = session?.user?.username || "User"; // Defaulting to "User" if username is not found

  const [joinRequests, setJoinRequests] = useState<any>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>("/default-avatar.svg");

  const handleUserModalToggle = () => setIsUserModalOpen(!isUserModalOpen);
  const handleUserModalClose = () => setIsUserModalOpen(false);

  const handleNotificationModalToggle = () =>
    setIsNotificationModalOpen(!isNotificationModalOpen);
  const handleNotificationModalClose = () => setIsNotificationModalOpen(false);

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const response = await fetch(
          `/api/organizations/join?username=${username}`
        );
        if (response.ok) {
          const data = await response.json();
          setJoinRequests(data.notifications);
          console.log(data.notifications);
        } else {
          console.error("Failed to fetch join requests");
        }
      } catch (error) {
        console.error("Error fetching join requests:", error);
      } 
    };

    if (username) {
      fetchJoinRequests();
    }
  }, [username]);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(`/api/user/update/image/getUrl?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          setAvatarUrl(data.imageUrl || "/default-avatar.svg");
        } else {
          console.error("Failed to fetch user avatar");
        }
      } catch (error) {
        console.error("Error fetching user avatar:", error);
      }
    };

    if (username != "User") {
      fetchAvatar();
    }
  }, [username]);

  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex justify-between items-center text-white">
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
                  src={avatarUrl}
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
                {joinRequests ? (
                  <BellRing className="w-6 h-6 text-white" />
                ) : (
                  <Bell className="w-6 h-6 text-white" />
                )}
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
                joinRequests={joinRequests}
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
