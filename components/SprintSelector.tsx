import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Sprint } from "@/components/types";

interface NewSprint {
  name: string;
  startDate: string;
  endDate: string;
}

interface SprintSelectorProps {
  sprints: Sprint[];
  selectedSprint?: Sprint | null;
  projectId?: string;
  isLoading: boolean;
  handleUpdateSprint: any;
  handleUpdateSprints: any;
}

const SprintSelector: React.FC<SprintSelectorProps> = ({
  sprints,
  selectedSprint,
  projectId,
  handleUpdateSprint,
  handleUpdateSprints,
}) => {
  const [isCreateSprintDialogOpen, setIsCreateSprintDialogOpen] =
    useState(false);
  const [newSprint, setNewSprint] = useState<NewSprint>({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { name, startDate, endDate } = newSprint;
    const isValid = Boolean(
      name && startDate && endDate && new Date(startDate) < new Date(endDate)
    );
    setIsFormValid(isValid);
  }, [newSprint]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSprint((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const createSprint = async () => {
    if (
      !projectId ||
      !newSprint.name ||
      !newSprint.startDate ||
      !newSprint.endDate
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/projects/sprints/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          ...newSprint,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create sprint");
      }

      const createdSprint = await response.json();

      // Update sprints by adding the new sprint
      const newSprintWithEmptyIssues = {
        ...createdSprint,
        issues: [],
        projectId,
      };

      const updatedSprints = [...sprints, newSprintWithEmptyIssues];
      // setSprints(updatedSprints);
      // setSelectedSprint(newSprintWithEmptyIssues);

      handleUpdateSprint(newSprintWithEmptyIssues);
      handleUpdateSprints(updatedSprints);

      // Reset form
      setNewSprint({ name: "", startDate: "", endDate: "" });
      setIsCreateSprintDialogOpen(false);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create sprint";
      setError(errorMessage);
      console.error("Error creating sprint:", err);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Select
        value={selectedSprint?.id ? selectedSprint.id.toString() : ""}
        onValueChange={(value) => {
          const sprint = sprints.find((s) => s.id === parseInt(value));
          handleUpdateSprint(sprint);
        }}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select Sprint" />
        </SelectTrigger>
        <SelectContent>
          {sprints.map((sprint) => (
            <SelectItem
              key={sprint.id?.toString()}
              value={sprint.id?.toString() || ""}
            >
              {sprint.name} ({sprint.startDate} - {sprint.endDate})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog
        open={isCreateSprintDialogOpen}
        onOpenChange={setIsCreateSprintDialogOpen}
      >
        <DialogTrigger asChild>
          <Button variant="default">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Sprint
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Sprint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Sprint Name</Label>
              <Input
                id="name"
                name="name"
                value={newSprint.name}
                onChange={handleInputChange}
                placeholder="Enter sprint name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={newSprint.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={newSprint.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Button
              onClick={createSprint}
              className="w-full"
              disabled={!isFormValid}
            >
              Create Sprint
            </Button>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            {!isFormValid && !error && (
              <div className="text-red-500 text-sm mt-2">
                Please make sure all fields are filled out and the end date is
                after the start date.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SprintSelector;
