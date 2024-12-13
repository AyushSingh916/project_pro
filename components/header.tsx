"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import UserModal from "./Modals/modal";
import NotificationModal from "./notifications";
import { Bell, BellRing, Menu } from "lucide-react";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const username = session?.user?.username || "User";
  const [joinRequests, setJoinRequests] = useState<any>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>("/default-avatar.svg");

  const handleDemoSignIn = async () => {
    try {
      const result = await signIn("credentials", {
        email: "ayushsingh916924@gmail.com",    
        password: "123456",  
        redirect: false,
      });
      
      if (result?.error) {
        console.error("Demo sign in failed:", result.error);
      }
    } catch (error) {
      console.error("Error during demo sign in:", error);
    }
  };

  const handleUserModalToggle = () => setIsUserModalOpen(!isUserModalOpen);
  const handleUserModalClose = () => setIsUserModalOpen(false);

  const handleNotificationModalToggle = () =>
    setIsNotificationModalOpen(!isNotificationModalOpen);
  const handleNotificationModalClose = () => setIsNotificationModalOpen(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const response = await fetch(
          `/api/organizations/join?username=${username}`
        );
        if (response.ok) {
          const data = await response.json();
          setJoinRequests(data.notifications);
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
        const response = await fetch(
          `/api/user/update/image/getUrl?username=${username}`
        );
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
    <header className="container mx-auto bg-black">
      <nav className="py-6 px-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center text-white">
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold">
              <Image
                src={"/logo.svg"}
                alt="ProjectPro Logo"
                width={400}
                height={112}
                className="h-20 w-auto object-contain"
              />
            </h1>
          </Link>

          <div className="flex-grow flex justify-center">
            {!session && (
              <Button
                onClick={handleDemoSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                Sign In with Demo Account
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {session?.user && (
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
              </>
            )}
            {!session && (
              <>
                <Button onClick={() => router.push("/signin")}>Sign In</Button>
                <Button onClick={() => router.push("/signup")}>Sign Up</Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col text-white">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src={"/logo.svg"}
                alt="ProjectPro Logo"
                width={200}
                height={56}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-gray-800"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="flex flex-col gap-4 mt-4">
              {!session && (
                <>
                  <Button
                    onClick={handleDemoSignIn}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                  >
                    Sign In with Demo Account
                  </Button>
                  <Button 
                    onClick={() => router.push("/signin")}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => router.push("/signup")}
                    className="w-full"
                  >
                    Sign Up
                  </Button>
                </>
              )}
              {session?.user && (
                <div className="flex items-center gap-4 justify-center">
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
                </div>
              )}
            </div>
          )}
        </div>

        {/* Only render modals if we have a session and user */}
        {session?.user && (
          <>
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
      </nav>
    </header>
  );
}

export default Header;