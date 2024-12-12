import React, { useState, useEffect } from "react";

function JoinRequestModal({ isOpen, onClose, joinRequests }: any) {
  const [requests, setRequests] = useState<any>([]);

  useEffect(() => {
    if (isOpen) {
      setRequests(joinRequests);
    }
  }, [joinRequests, isOpen]);

  if (!isOpen) return null;

  const handleAction = async (
    requestId: string,
    action: "approve" | "cancel",
    senderUsername: string,
    organizationSlug: string
  ) => {
    try {
      const response = await fetch(`/api/organizations/join/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          action,
          senderUsername,
          organizationSlug,
        }),
      });

      if (response.ok) {
        setRequests((prevRequests: any) =>
          prevRequests.filter((request: any) => request.id !== requestId)
        );
      } else {
        console.error(`Failed to ${action} request with ID:`, requestId);
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

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
          {requests.length > 0 ? (
            requests.map((request: any) => (
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
                      onClick={() =>
                        handleAction(
                          request.id,
                          "approve",
                          request.senderUsername,
                          request.organization.slug
                        )
                      }
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleAction(
                          request.id,
                          "cancel",
                          request.senderUsername,
                          request.organization.slug
                        )
                      }
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
