import React from "react";
import { Mail, Shield, User, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const ViewEmployeeDialog = ({ employee, open, onOpenChange }) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>
            Full profile information for {employee.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full flex items-center justify-center text-[16px] font-bold bg-muted text-foreground">
              {employee.name
                .split(" ")
                .filter(Boolean)
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-[15px] font-semibold capitalize">{employee.name}</p>
              <p className="text-[12.5px] text-muted-foreground">Active member</p>
            </div>
          </div>

          <div className="grid gap-3 text-[13.5px]">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-muted-foreground" />
              <span>{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-muted-foreground" />
              <Badge variant="secondary" className="capitalize">
                {employee.role}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Hash size={14} className="text-muted-foreground" />
              <span className="font-mono text-[12.5px]">
                #{employee._id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployeeDialog;