import { Briefcase, Calendar, Camera, Pencil, User, Users } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NavLink } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEmployee } from "../../api/EmployeeApi";

const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "Hr",
  "Developer",
  "Administrative",
  "Common",
  "Security",
  "Management",
];
const ROLES = ["Admin", "Employee"];

const AddEmployee = () => {
  const [photoPreview, setPhotoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      department: "",
      role: "",
      joiningDate: "",
      status: "active",
      photo: null,
      password: "",
    },
  });

  const onSubmit = async (data, event) => {
    event?.preventDefault();
    try {
      await createEmployee(data);
    } catch (error) {
      console.log("error in api", error);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("photo", file, { shouldValidate: true, shouldDirty: true });
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full min-h-full px-8 py-8 bg-background">
      {/* Breadcrumb */}
      <p className="text-[13px] mb-1 text-muted-foreground">
        <NavLink to="/home/employee">Team</NavLink>
        <span className="mx-1">{">"}</span>
        <span className="font-semibold text-foreground">
          <NavLink to="/home/add-employee">Add New Employee</NavLink>
        </span>
      </p>

      <h1 className="text-3xl font-extrabold text-foreground">Add Employee</h1>
      <p className="text-[14px] mt-1 text-muted-foreground">
        Configure the new team member's workspace profile and permissions.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        {/* Personal Information */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User size={20} className="text-[#4f46e5]" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Photo upload */}
              <div className="flex flex-col items-center flex-shrink-0">
                <label
                  htmlFor="photo-upload"
                  className="relative h-36 w-36 rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden border-[1.5px] border-dashed bg-muted/40"
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <Camera size={26} className="text-muted-foreground" />
                      <span className="text-[12px] mt-2 font-medium text-muted-foreground">
                        Upload Photo
                      </span>
                    </>
                  )}
                  <span className="absolute bottom-1.5 right-1.5 h-6 w-6 rounded-full flex items-center justify-center bg-[#4f46e5]">
                    <Pencil size={12} color="#ffffff" />
                  </span>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
                <p className="text-[11px] mt-2 text-center text-muted-foreground">
                  JPG or PNG. Max size of 800K.
                </p>
              </div>

              {/* Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    className="mt-1.5"
                    {...register("name", {
                      required: "Full name is required",
                    })}
                  />
                  {errors.name && (
                    <p className="text-[12px] text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="sarah.j@teamsync.ai"
                    className="mt-1.5"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-[12px] text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="text"
                    placeholder="Password"
                    className="mt-1.5"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-[12px] text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio / About</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    placeholder="Tell us about the new team member…"
                    className="mt-1.5 resize-none"
                    {...register("bio")}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card className="mt-5">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase size={20} className="text-[#4f46e5]" />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>
                  Department <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="department"
                  control={control}
                  rules={{ required: "Select a department" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full mt-1.5">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.department && (
                  <p className="text-[12px] text-red-500 mt-1">
                    {errors.department.message}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  Role <span className="text-red-500">*</span>
                </Label>
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
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <p className="text-[12px] text-red-500 mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="joiningDate"
                  className="flex items-center gap-1.5"
                >
                  Joining Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="joiningDate"
                    type="date"
                    className="pr-9"
                    {...register("joiningDate", {
                      required: "Joining date is required",
                    })}
                  />
                  <Calendar
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                  />
                </div>
                {errors.joiningDate && (
                  <p className="text-[12px] text-red-500 mt-1">
                    {errors.joiningDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Employment Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex items-center gap-5 mt-3"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="active" id="status-active" />
                        <Label
                          htmlFor="status-active"
                          className="cursor-pointer font-normal"
                        >
                          Active
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="inactive" id="status-inactive" />
                        <Label
                          htmlFor="status-inactive"
                          className="cursor-pointer font-normal"
                        >
                          Inactive
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#4f46e5] hover:bg-[#4338ca] text-white"
          >
            <Users size={16} />
            Create Employee
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
