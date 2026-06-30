import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// target shape: { employee, nextStatus } where nextStatus is "active" | "inactive"
const ToggleStatusDialog = ({ target, open, onOpenChange, onConfirm }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!target) return null;
  const { employee, nextStatus } = target;
  const goingInactive = nextStatus === "inactive";

  const handleConfirm = async () => {
    setIsUpdating(true);
    try {
      await onConfirm(employee._id, nextStatus);
      onOpenChange(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {goingInactive
              ? `Mark ${employee.name} as inactive?`
              : `Mark ${employee.name} as active?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {goingInactive
              ? "They'll lose access but their record and history will be preserved. You can reactivate them later."
              : "They'll regain access to their account and be shown as an active member."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
          <Button
            className={
              goingInactive
                ? "bg-[#c0a81b] hover:bg-[#a8930f] text-white"
                : "bg-[#16a34a] hover:bg-[#15803d] text-white"
            }
            onClick={handleConfirm}
            disabled={isUpdating}
          >
            {isUpdating
              ? "Updating..."
              : goingInactive
              ? "Mark Inactive"
              : "Mark Active"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ToggleStatusDialog;