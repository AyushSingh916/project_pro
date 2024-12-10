"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserModal from "./modal";

function Header() {
  const { data: session } = useSession();
  //   console.log(session?.user.provider);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => setIsModalOpen(!isModalOpen);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold">
            <Image
              src={"/logo.svg"}
              alt="Zscrum Logo"
              width={200}
              height={56}
              className="h-10 w-auto object-contain"
            />
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {session && (
            <>
              <div>
                <button
                  className="w-10 h-10 rounded-full overflow-hidden border border-gray-300"
                  onClick={handleModalToggle}
                >
                  <Image
                    src={session.user?.image || "/default-avatar.svg"}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </button>
                <UserModal
                  user={session.user}
                  isOpen={isModalOpen}
                  onClose={handleModalClose}
                  onSignOut={signOut}
                />
              </div>
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
