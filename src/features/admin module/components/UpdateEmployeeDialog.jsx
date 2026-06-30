import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

const ROLES = ["admin", "employee"];

const UpdateEmployeeDialog = ({ employee, open, onOpenChange, onUpdate }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", role: "" },
  });

  // Reset form values whenever a new employee is loaded into the dialog
  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name,
        email: employee.email,
        role: employee.role,
      });
    }
  }, [employee, reset]);

  const onSubmit = async (formData) => {
    await onUpdate(employee._id, formData);
    onOpenChange(false);
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Employee</DialogTitle>
          <DialogDescription>
            Edit details for {employee.name}. Changes save immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="update-name">Full Name</Label>
            <Input
              id="update-name"
              className="mt-1.5"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-[12px] text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="update-email">Email</Label>
            <Input
              id="update-email"
              type="email"
              className="mt-1.5"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
            />
            {errors.email && (
              <p className="text-[12px] text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>Role</Label>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Select a role" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full mt-1.5">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r} className="capitalize">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-[12px] text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          <DialogFooter className="mt-5">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEmployeeDialog;