import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Collaborator {
  username: string;
  email: string;
}

interface AddCollaboratorModalProps {
  open: boolean;
  onClose: () => void;
  onAddCollaborator: (memberId: string) => void;
  prId: string;
}

const AddCollaboratorModal = ({
  open,
  onClose,
  onAddCollaborator,
  prId
}: AddCollaboratorModalProps) => {
  const [members, setMembers] = useState<Collaborator[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/organizations/members?projectId=${prId}`);
        const data = await response.json();
  
        if (response.ok) {
          setMembers(data.members || []);
        } else {
          console.error("Error fetching members:", data.error);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
  
    fetchMembers();
  }, [prId]);
  

  const handleAddCollaborator = () => {
    if (selectedMember) {
      onAddCollaborator(selectedMember);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        {/* <Button variant="default">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Collaborator
        </Button> */}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Collaborator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label>Select Member</Label>
          <Select value={selectedMember || ""} onValueChange={setSelectedMember}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.username} value={member.username}>
                  {member.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleAddCollaborator} className="w-full mt-4">
            Add Collaborator
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCollaboratorModal;
