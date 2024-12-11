"use client";

import { useSession } from "next-auth/react";
import FAQComponent from "@/components/faq";
import FeaturesComponent from "@/components/features";
import HeroComponent from "@/components/hero";
import OrganizationList from "@/components/organizationlist";
import AssignedTasksList from "@/components/tasklist";


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
    };
  }

  interface User {
    id: string;
    username: string;
    email: string;
  }
}



export default function Home() {
  const { data: session } = useSession();

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
        <h1 className="text-3xl font-bold mb-8">Welcome, {session.user?.username}</h1>
        
        {/* Organizations Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Your Organizations</h2>
          <OrganizationList />
        </section>

        {/* Assigned Tasks Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Assigned Tasks</h2>
          <AssignedTasksList />
        </section>
      </div>
    </div>
  );
}