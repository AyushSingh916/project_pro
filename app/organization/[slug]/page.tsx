"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Users2, FolderKanban, ArrowLeft, Mail, User } from "lucide-react";
import CreateProjectModal from "@/components/CreateProjectModal";
import Link from "next/link";

interface User {
  username: string;
  email: string;
}

interface Project {
  id: number;
  name: string;
  description: string | null;
  status: string | null;
}

interface Organization {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  admin: User;
  users: User[];
  projects: Project[];
}

const OrganizationPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSlug = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    fetchSlug();
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    const fetchOrganization = async () => {
      try {
        const response = await fetch("/api/organizations/find", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setOrganization(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch organization");
      } finally {
        setLoading(false);
      }
    };
    fetchOrganization();
  }, [slug]);

  const handleCreateProject = async (name: string, description: string) => {
    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          organizationSlug: slug,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const newProject = await response.json();
      setOrganization((prev) =>
        prev
          ? { ...prev, projects: [...prev.projects, newProject] }
          : null
      );

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => router.push("/organization")}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-5xl">
      <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Organizations
      </Button>

      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                <Building2 className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{organization?.name}</CardTitle>
              <CardDescription className="mt-2">
                {organization?.description || "No description provided"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Admin Info */}
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <User className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg">Admin Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{organization?.admin.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{organization?.admin.username}</div>
              <div className="text-muted-foreground text-sm flex items-center gap-1">
                <Mail size={14} /> {organization?.admin.email}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users */}
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <Users2 className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg">Users</CardTitle>
        </CardHeader>
        <CardContent>
          {organization?.users.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No users in this organization.
            </div>
          ) : (
            <div className="space-y-4">
              {organization?.users.map((user, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{user.username}</div>
                    <div className="text-muted-foreground text-sm">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <div className="flex justify-between items-center">
          <CardHeader className="flex flex-row items-center space-x-2">
            <FolderKanban className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Projects</CardTitle>
          </CardHeader>
          <Button
            variant="destructive"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 mr-6"
          >
            Create Project
          </Button>
        </div>

        <CardContent>
          {organization?.projects.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No projects found for this organization.
            </div>
          ) : (
            <div className="grid gap-4">
              {organization?.projects.map((project) => (
                <Link href={`project/${project.id}`}>
                  <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant="secondary">{project.status}</Badge>
                    </div>
                    <CardDescription>
                      {project.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default OrganizationPage;
