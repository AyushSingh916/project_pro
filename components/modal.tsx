'use client';

import { Button } from "./ui/button";
import Image from "next/image";

export default function UserModal({ user, isOpen, onClose, onSignOut } : any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <div className="flex items-center gap-3">
          <Image
            src={user?.image || "/default-avatar.png"}
            alt="User Avatar"
            width={50}
            height={50}
            className="object-cover rounded-full"
          />
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="destructive" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
