import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function JoinRequestModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;

  const { data: session, status } = useSession();
  const username = session?.user?.username || "User"; // Defaulting to "User" if username is not found

  const [joinRequests, setJoinRequests] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true); // To show loading state

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const response = await fetch(`/api/organizations/join?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          setJoinRequests(data.notifications); 
          console.log(data.notifications);
        } else {
          console.error("Failed to fetch join requests");
        }
      } catch (error) {
        console.error("Error fetching join requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchJoinRequests();
    }
  }, [username]); // Re-fetch when username changes

  const handleApprove = (requestId: string) => {
    // Handle the approve action for a join request
    console.log("Approved request with ID:", requestId);
    // Add further logic for approval (e.g., API call to approve the request)
  };

  const handleCancel = (requestId: string) => {
    // Handle the cancel action for a join request
    console.log("Cancelled request with ID:", requestId);
    // Add further logic for canceling the request (e.g., API call to cancel the request)
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg w-80 p-4">
          <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
            <h2 className="text-lg font-semibold">Join Requests</h2>
            <button
              className="text-gray-400 hover:text-gray-200"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg w-80 p-4">
        <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
          <h2 className="text-lg font-semibold">Join Requests</h2>
          <button
            className="text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <ul className="space-y-2">
          {joinRequests.length > 0 ? (
            joinRequests.map((request: any) => (
              <li
                key={request.id}
                className="text-sm border-b border-gray-700 pb-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{request.senderUsername}</p>
                    <p className="text-gray-400">{request.organization.name}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleCancel(request.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-400">No join requests</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default JoinRequestModal;
