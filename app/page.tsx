"use client";

import { useSession } from "next-auth/react";
import FAQComponent from "@/components/faq";
import FeaturesComponent from "@/components/features";
import HeroComponent from "@/components/hero";
import OrganizationList from "@/components/organizationlist";
import AssignedTasksList from "@/components/tasklist";

type OrganizationRole = 'ADMIN' | 'CONTRIBUTOR' | 'MEMBER' | 'VIEWER';

interface Organization {
  id: string;
  name: string;
  description?: string;
  userRole: OrganizationRole;
}

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: string;
  project: {
    name: string;
    organization: {
      name: string;
    };
  };
}

export default function Home() {
  const { data: session } = useSession();

  const organizations: Organization[] = [
    { 
      id: '1', 
      name: 'Example Org', 
      description: 'A sample organization for demonstration',
      userRole: 'ADMIN'
    },
    { 
      id: '2', 
      name: 'Another Organization', 
      description: 'A different organization',
      userRole: 'CONTRIBUTOR'
    }
  ];

  const assignedTasks: Issue[] = [
    {
      id: '1',
      title: 'Implement Dashboard',
      status: 'In Progress',
      priority: 'High',
      project: {
        name: 'Project Management App',
        organization: {
          name: 'Example Org'
        }
      }
    }
  ];

  if (!session) {
    return (
      <div className="min-h-screen animated-dotted-background">
        <HeroComponent />
        <FeaturesComponent />
        <FAQComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome, {session.user?.name || 'User'}</h1>
        
        {/* Organizations Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Your Organizations</h2>
          {organizations.length > 0 ? (
            <OrganizationList organizations={organizations} />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">You haven't joined any organizations yet.</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Create Organization
              </button>
            </div>
          )}
        </section>

        {/* Assigned Tasks Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Assigned Tasks</h2>
          {assignedTasks.length > 0 ? (
            <AssignedTasksList issues={assignedTasks} />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">No tasks assigned to you at the moment.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}