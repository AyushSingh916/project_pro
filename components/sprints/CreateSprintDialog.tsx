import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewSprint } from "../types";
import { useState } from "react";

interface CreateSprintDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (sprint: NewSprint) => void;
}

export const CreateSprintDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
}: CreateSprintDialogProps) => {
  const [newSprint, setNewSprint] = useState<NewSprint>({
    name: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = () => {
    onSubmit(newSprint);
    setNewSprint({ name: "", startDate: "", endDate: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Sprint</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Sprint Name</Label>
            <Input
              placeholder="Enter sprint name"
              value={newSprint.name}
              onChange={(e) =>
                setNewSprint({ ...newSprint, name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={newSprint.startDate}
                onChange={(e) =>
                  setNewSprint({
                    ...newSprint,
                    startDate: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={newSprint.endDate}
                onChange={(e) =>
                  setNewSprint({
                    ...newSprint,
                    endDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Create Sprint
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};