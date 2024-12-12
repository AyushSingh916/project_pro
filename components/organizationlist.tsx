"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, Plus, Shield, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type OrganizationRole =
  | "ADMIN"
  | "CONTRIBUTOR"
  | "MEMBER"
  | "VIEWER"
  | "PENDING";

interface Organization {
  id?: string;
  name: string;
  description?: string;
  userRole: OrganizationRole;
  slug?: string;
  adminUsername?: string;
}

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

export default function OrganizationList() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [orgDescription, setOrgDescription] = useState(""); // Add state for description
  const [joinOrgSlug, setJoinOrgSlug] = useState("");
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();

  const username = session?.user?.username ?? "User";

  const { toast } = useToast();

  const getRoleBadgeVariant = (role: string): "destructive" | "secondary" | "outline" | "default" | null => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "CONTRIBUTOR":
        return "secondary";
      case "MEMBER":
        return "outline";
      default:
        return "default";
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setOrgName(name);
    setOrgSlug(
      name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrgDescription(e.target.value); // Update description state
  };

  const handleSubmit = async () => {
    console.log("Creating organization:", {
      name: orgName,
      slug: orgSlug,
      description: orgDescription,
    });

    try {
      const response = await fetch("/api/organizations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: orgName,
          slug: orgSlug,
          description: orgDescription,
          username: username,
        }),
      });

      // Check for HTTP errors
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.message ||
            "Could not create organization. Please try again.",
          variant: "destructive",
        });
        console.error("Error response from server:", errorData);
        return;
      }

      toast({
        title: "Organization Created",
        description: `The organization "${orgName}" has been created successfully.`,
      });

      // Update state
      setIsModalOpen(false);
      setOrgName("");
      setOrgSlug("");
      setOrgDescription("");
      setOrganizations((prev) => [
        ...prev,
        {
          name: orgName,
          description: orgDescription,
          slug: orgSlug,
          userRole: "ADMIN",
        },
      ]);

      console.log("Updated organizations list:", organizations);
    } catch (error) {
      // Catch any unexpected errors
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Unexpected error creating organization:", error);
    }
  };

  const handleDeleteOrganization = async (orgSlug: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the organization "${orgSlug}"?`
      )
    ) {
      try {
        const response = await fetch(`/api/organizations/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug: orgSlug }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast({
            title: "Error",
            description:
              errorData.message ||
              "Could not delete organization. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Organization Deleted",
          description: `The organization "${orgSlug}" has been deleted successfully.`,
        });

        // Remove the organization from the state
        setOrganizations((prev) => prev.filter((org) => org.slug !== orgSlug));
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        console.error("Unexpected error deleting organization:", error);
      }
    }
  };

  const handleJoinOrganization = async () => {
    if (!joinOrgSlug) {
      toast({
        title: "Error",
        description: "Please enter an organization slug",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetch("/api/organizations/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: joinOrgSlug, username: username }),
      });

      toast({
        title: "Join Request Sent",
        description: `Your request to join ${"Google"} is pending admin approval.`,
      });

      setIsJoinModalOpen(false);
      setJoinOrgSlug("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not send join request. Please try again.",
        variant: "destructive",
      });
      console.error("Join request error:", error);
    }
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        if (!username) {
          toast({
            title: "Error",
            description: "Username is missing. Please log in again.",
            variant: "destructive",
          });
          return;
        }

        const response = await fetch("/api/organizations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        const result = await response.json();

        const organizationsWithRole = result.organizations?.map(
          (org: Organization) => {
            const userRole =
              org.adminUsername === username ? "ADMIN" : "CONTRIBUTOR";
            return { ...org, userRole };
          }
        );

        setOrganizations(organizationsWithRole || []);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        toast({
          title: "Error",
          description: "Failed to load organizations.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [username, toast]);

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {organizations.length === 0 ? (
        <div className="text-center text-muted">No organizations found.</div>
      ) : (
        organizations.map((org, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center space-x-3">
                <Building2 className="h-6 w-6 text-muted-foreground" />
                <CardTitle className="flex items-center space-x-2">
                  {org.name}
                  <Badge
                    variant={getRoleBadgeVariant(org.userRole)}
                    className="ml-2"
                  >
                    {org.userRole}
                  </Badge>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {org.description && (
                <CardDescription>{org.description}</CardDescription>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link href={`/organization/${org.slug}`}>View Details</Link>
                </Button>
              </div>
              <div className="flex space-x-2">
                {org.userRole === "CONTRIBUTOR" && (
                  <Button variant="outline" size="icon" title="Admin Settings">
                    <Shield className="h-4 w-4" />
                  </Button>
                )}
                {org.userRole === "PENDING" && (
                  <Badge variant="default">Pending Approval</Badge>
                )}
                {org.userRole === "ADMIN" && (
                  <Button
                    variant="destructive"
                    size="icon"
                    title="Delete Organization"
                    onClick={() => handleDeleteOrganization(org.slug || "")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Organization
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Fill in the details for your new organization.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orgName" className="text-right">
                Name
              </Label>
              <Input
                id="orgName"
                value={orgName}
                onChange={handleNameChange}
                className="col-span-3"
                placeholder="Enter organization name"
              />
              <Label htmlFor="orgDescription" className="text-right">
                Description
              </Label>
              <Input
                id="orgDescription"
                value={orgDescription}
                onChange={handleDescriptionChange}
                className="col-span-3"
                placeholder="Describe your organization"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orgSlug" className="text-right">
                Slug
              </Label>
              <Input
                id="orgSlug"
                value={orgSlug}
                readOnly
                className="col-span-3 bg-muted"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!orgName.trim() || !orgDescription.trim()}
            >
              Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsJoinModalOpen(true)}
      >
        <Send className="mr-2 h-4 w-4" /> Join Organization
      </Button>

      <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join an Organization</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joinOrgSlug" className="text-right">
                Organization Slug
              </Label>
              <Input
                id="joinOrgSlug"
                value={joinOrgSlug}
                onChange={(e) => setJoinOrgSlug(e.target.value)}
                className="col-span-3"
                placeholder="Enter organization slug"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleJoinOrganization}
              disabled={!joinOrgSlug.trim()}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
