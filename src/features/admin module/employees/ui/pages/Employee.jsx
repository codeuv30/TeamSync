import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  MoreHorizontal,
  UserPlus,
  Mail,
  Shield,
  User,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Download,
  Filter,
  Check,
  FileDown,
  Trash2,
  Eye,
  PencilIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import useEmployee from "../../hooks/useEmployee.jsx";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ViewEmployeeDialog from "@/features/admin module/components/ViewEmployeeDialog.jsx";
import UpdateEmployeeDialog from "@/features/admin module/components/UpdateEmployeeDialog.jsx";
import DeleteEmployeeDialog from "@/features/admin module/components/DeleteEmployeeDialog.jsx";
import ToggleStatusDialog from "@/features/admin module/components/ToggleStatusDialog.jsx";
import {
  updateEmployee,
  deleteEmployee,
  markEmployeeInactive,
} from "../../api/EmployeeApi.js";

const cn = (...classes) => classes.filter(Boolean).join(" ");

/* ═══════════════════════════════════════════════════════════════════
   Business Components
   ═══════════════════════════════════════════════════════════════════ */

const ROLE_STYLES = {
  admin: { bg: "rgba(124,58,237,0.12)", color: "#8b5cf6", icon: Shield },
  employee: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6", icon: User },
};

const Avatar = React.memo(function Avatar({ name }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div
      className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 text-[15px] font-bold shadow-sm bg-muted text-foreground"
      title={name}
    >
      {initials}
    </div>
  );
});

const RoleBadge = React.memo(function RoleBadge({ role }) {
  const s = ROLE_STYLES[role] || {
    bg: "rgba(107,114,128,0.12)",
    color: "#9ca3af",
    icon: User,
  };
  const Icon = s.icon;
  return (
    <Badge
      variant="secondary"
      className="capitalize gap-1 border-0"
      style={{ background: s.bg, color: s.color }}
    >
      <Icon size={12} />
      {role}
    </Badge>
  );
});

const StatCard = React.memo(function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}) {
  return (
    <div className="flex-1 rounded-xl border bg-card px-5 py-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <h3 className="text-[26px] font-bold leading-none mt-2 text-card-foreground">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-[#7c3aed]/10">
            <Icon size={18} className="text-[#8b5cf6]" />
          </div>
        )}
      </div>
      {sub && <p className="text-[12px] mt-2 text-muted-foreground">{sub}</p>}
    </div>
  );
});

const SkeletonRow = React.memo(function SkeletonRow() {
  return (
    <TableRow>
      {[4, 30, 30, 16, 14, 6].map((w, j) => (
        <TableCell key={j} className="px-4 py-3.5">
          <div
            className="h-3.5 rounded animate-pulse bg-muted"
            style={{ width: `${40 + j * 15}%` }}
          />
        </TableCell>
      ))}
    </TableRow>
  );
});

/* ═══════════════════════════════════════════════════════════════════
   Memoized Table Row
   Extracted so typing in search / opening one row's menu doesn't
   force every other row to re-render.
   ═══════════════════════════════════════════════════════════════════ */
const EmployeeRow = React.memo(function EmployeeRow({
  emp,
  selected,
  onToggleSelect,
  onView,
  onUpdate,
  onToggleStatus,
  onDelete,
}) {
  const isActive = emp.status !== "inactive";

  return (
    <TableRow data-state={selected ? "selected" : undefined} className="group">
      {/* Checkbox */}
      <TableCell className="px-4 py-3">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(emp._id)}
          aria-label={`Select ${emp.name}`}
        />
      </TableCell>

      {/* Employee */}
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={emp.name} />
          <div className="min-w-0">
            <span
              className="text-[13.5px] font-semibold capitalize block truncate text-card-foreground"
              title={emp.name}
            >
              {emp.name}
            </span>
            <span className="text-[11.5px] block truncate text-muted-foreground">
              {isActive ? "Active member" : "Inactive"}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Email */}
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Mail size={13} className="text-muted-foreground flex-shrink-0" />
          <span
            className="text-[13px] block truncate font-medium text-foreground/90"
            title={emp.email}
          >
            {emp.email}
          </span>
        </div>
      </TableCell>

      {/* Role */}
      <TableCell className="px-4 py-3">
        <RoleBadge role={emp.role} />
      </TableCell>

      {/* ID */}
      <TableCell className="px-4 py-3">
        <span className="text-[12px] font-mono text-muted-foreground">
          #{emp._id.slice(-6).toUpperCase()}
        </span>
      </TableCell>

      {/* Actions */}
      <TableCell className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdate(emp)}>
              <PencilIcon size={14} />
              Update Employee
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[#c0a81b] focus:text-[#c0a81b]"
              onClick={() => onToggleStatus(emp)}
            >
              <Eye size={14} />
              {isActive ? "Mark Inactive" : "Mark Active"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onView(emp)}>
              <Eye size={14} />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={() => onDelete(emp)}
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});

/* ═══════════════════════════════════════════════════════════════════
   CSV Export Helper
   ═══════════════════════════════════════════════════════════════════ */
const exportToCSV = (employees, filename = "employees.csv") => {
  if (!employees.length) return;
  const headers = ["Name", "Email", "Role", "ID"];
  const rows = employees.map((e) => [e.name, e.email, e.role, e._id]);
  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/* ═══════════════════════════════════════════════════════════════════
   Debounce Hook
   ═══════════════════════════════════════════════════════════════════ */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

/* ═══════════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════════ */

const Employee = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* ── State ── */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRows, setSelectedRows] = useState(new Set());

  /* ── Dialog state ── */
  const [viewTarget, setViewTarget] = useState(null);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null); // { employee, nextStatus }

  /* ── Row action handlers — each just opens its dialog with the row's data ── */
  const handleView = useCallback((emp) => setViewTarget(emp), []);
  const handleUpdate = useCallback((emp) => setUpdateTarget(emp), []);
  const handleDeleteRequest = useCallback((emp) => setDeleteTarget(emp), []);

  const handleToggleStatusRequest = useCallback((emp) => {
    const nextStatus = emp.status === "inactive" ? "active" : "inactive";
    setStatusTarget({ employee: emp, nextStatus });
  }, []);

  /* ── Mutation logic, passed down to the dialogs. After each mutation
     we invalidate the "employees" query so every component reading it
     (this table, stats cards, etc.) refetches with fresh data. If your
     useEmployee hook uses a different queryKey, update the key below
     to match — it must match by reference equality on the array. ── */
  const handleUpdateSubmit = useCallback(
    async (id, formData) => {
      await updateEmployee(id, formData);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    [queryClient],
  );

  const handleDeleteConfirm = useCallback(
    async (id) => {
      await deleteEmployee(id);
      setSelectedRows((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    [queryClient],
  );

  const handleStatusConfirm = useCallback(
    async (id, nextStatus) => {
      await markEmployeeInactive(id, nextStatus);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    [queryClient],
  );

  /* ── Debounced search for API ── */
  const debouncedSearch = useDebounce(searchInput, 400);

  /* ── API Call: backend supports page/limit/search/role/department/status.
     ALWAYS pass a stable object so the queryKey hashes consistently. ── */
  const queryParams = useMemo(
    () => ({
      page: page || 1,
      search: debouncedSearch || "",
      // UI uses "all" as the sentinel for "no filter" (so the Select
      // can show a label), but the backend only checks truthiness —
      // it must receive "" or the param will be filtered on literally.
      role: roleFilter === "all" ? "" : roleFilter,
      limit: pageSize || 20,
    }),
    [page, debouncedSearch, roleFilter, pageSize],
  );

  const { data, isPending, isError, error } = useEmployee(queryParams);

  const employees = data?.employees ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    totalPages: 1,
    total: 0,
    limit: pageSize || 20,
  };

  /* ── Client-side sort only (filtering is now done server-side) ── */
  const sortedEmployees = useMemo(() => {
    if (!employees.length) return [];
    const sorted = [...employees].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else if (sortBy === "email") cmp = a.email.localeCompare(b.email);
      else if (sortBy === "role") cmp = a.role.localeCompare(b.role);
      else if (sortBy === "id") cmp = a._id.localeCompare(b._id);
      return sortOrder === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [employees, sortBy, sortOrder]);

  /* ── Stats (this page only — server already filtered) ── */
  const { adminCount, employeeCount } = useMemo(() => {
    let admin = 0;
    let emp = 0;
    for (const e of employees) {
      if (e.role === "admin") admin++;
      else if (e.role === "employee") emp++;
    }
    return { adminCount: admin, employeeCount: emp };
  }, [employees]);

  /* ── Handlers ── */
  const handleSearch = useCallback((e) => {
    setSearchInput(e.target.value);
    setPage(1);
    setSelectedRows(new Set());
  }, []);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setPage(1);
    setSelectedRows(new Set());
  }, []);

  const handleRoleFilter = useCallback((role) => {
    setRoleFilter(role);
    setPage(1);
    setSelectedRows(new Set());
  }, []);

  const toggleSort = useCallback((field) => {
    setSortBy((prevSortBy) => {
      setSortOrder((prevOrder) =>
        prevSortBy === field ? (prevOrder === "asc" ? "desc" : "asc") : "asc",
      );
      return field;
    });
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    setSelectedRows(new Set());
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedRows((prev) => {
      if (prev.size === sortedEmployees.length && sortedEmployees.length > 0) {
        return new Set();
      }
      return new Set(sortedEmployees.map((e) => e._id));
    });
  }, [sortedEmployees]);

  const toggleSelectRow = useCallback((id) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleExport = useCallback(() => {
    const toExport =
      selectedRows.size > 0
        ? sortedEmployees.filter((e) => selectedRows.has(e._id))
        : sortedEmployees;
    exportToCSV(
      toExport,
      `employees-${new Date().toISOString().slice(0, 10)}.csv`,
    );
  }, [sortedEmployees, selectedRows]);

  /* ── Pagination numbers ── */
  const pageNumbers = useMemo(() => {
    const total = pagination.totalPages;
    const current = pagination.page;
    const pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else if (current <= 3) {
      pages.push(1, 2, 3, 4, "...", total);
    } else if (current >= total - 2) {
      pages.push(1, "...", total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
    return pages;
  }, [pagination.totalPages, pagination.page]);

  /* ── Column definitions ── */
  const columns = useMemo(
    () => [
      { key: "select", label: "", sortable: false, width: "4%" },
      { key: "name", label: "Employee", sortable: true, width: "30%" },
      { key: "email", label: "Email", sortable: true, width: "30%" },
      { key: "role", label: "Role", sortable: true, width: "16%" },
      { key: "id", label: "ID", sortable: true, width: "14%" },
      { key: "actions", label: "", sortable: false, width: "6%" },
    ],
    [],
  );

  const allSelected =
    selectedRows.size === sortedEmployees.length && sortedEmployees.length > 0;

  return (
    <div className="font-sans w-full h-full px-6 py-5 min-h-screen bg-background">
      {/* ═══════ Header ═══════ */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-foreground">
            Employee Directory
          </h1>
          <p className="text-[13px] mt-1 text-muted-foreground">
            Manage your team's roles, access, and details
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <FileDown size={15} />
            Export CSV
          </Button>
          <Button
            size="sm"
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
            onClick={() => navigate("/home/add-employee")}
          >
            <UserPlus size={15} />
            Add Employee
          </Button>
        </div>
      </div>

      {/* ═══════ Stats ═══════ */}
      <div className="flex gap-3 mb-5">
        <StatCard
          label="Total Employees"
          value={pagination.total}
          sub={`${pagination.totalPages} page${pagination.totalPages !== 1 ? "s" : ""}`}
          icon={User}
        />
        <StatCard
          label="Admins"
          value={adminCount}
          sub={`${employeeCount} employee${employeeCount !== 1 ? "s" : ""}`}
          icon={Shield}
        />
        <StatCard
          label="This Page"
          value={employees.length}
          sub={`of ${pagination.limit} per page`}
          icon={Mail}
        />
      </div>

      {/* ═══════ Toolbar ═══════ */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3.5 rounded-t-xl border border-b-0 bg-card">
        {/* Search */}
        <div className="relative flex-1 max-w-[320px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
          />
          <Input
            value={searchInput}
            onChange={handleSearch}
            placeholder="Search by name..."
            className="pl-9 pr-9"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors hover:bg-accent text-muted-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Role Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter size={14} />
              Role: {roleFilter === "all" ? "All" : roleFilter}
              <ChevronDown size={13} className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <div className="space-y-1">
              <DropdownMenuLabel className="px-2">
                Filter by Role
              </DropdownMenuLabel>
              <Separator className="my-1" />
              {["all", "admin", "employee"].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleFilter(role)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-medium outline-none transition-colors hover:bg-accent",
                    roleFilter === role && "bg-[#7c3aed]/10 text-[#8b5cf6]",
                  )}
                >
                  {roleFilter === role && <Check size={14} />}
                  <span className={cn(roleFilter !== role && "ml-6")}>
                    {role === "all" ? "All Roles" : role}
                  </span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Page size */}
        <Select
          value={String(pageSize)}
          onValueChange={(v) => {
            setPageSize(Number(v));
            setPage(1);
            setSelectedRows(new Set());
          }}
        >
          <SelectTrigger className="h-8 w-[110px] text-[13px]">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-1 items-center" />
        <span className="text-[12.5px] font-medium text-muted-foreground">
          {pagination.total} result{pagination.total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ═══════ Bulk Actions Bar ═══════ */}
      {selectedRows.size > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-l border-r bg-[#7c3aed]/[0.04] dark:bg-[#7c3aed]/[0.08]">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#7c3aed]/20 text-[#8b5cf6] border-0">
              {selectedRows.size} selected
            </Badge>
            <span className="text-[12.5px] text-muted-foreground">
              {allSelected ? "All on this page" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download size={14} />
              Export Selected
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 size={14} />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* ═══════ Table ═══════ */}
      <div className="rounded-b-xl overflow-hidden border bg-card">
        <div className="overflow-x-auto">
          <Table style={{ tableLayout: "fixed", minWidth: 700 }}>
            <colgroup>
              {columns.map((c) => (
                <col key={c.key} style={{ width: c.width }} />
              ))}
            </colgroup>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "text-[11.5px] font-semibold uppercase tracking-wider px-4 py-3 text-muted-foreground",
                      col.sortable && "cursor-pointer select-none group",
                    )}
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    {col.key === "select" ? (
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={() => toggleSelectAll()}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Select all"
                      />
                    ) : (
                      <span className="flex items-center gap-1.5">
                        {col.label}
                        {col.sortable && (
                          <span className="inline-flex">
                            {sortBy === col.key ? (
                              sortOrder === "asc" ? (
                                <ArrowUp size={12} className="text-[#8b5cf6]" />
                              ) : (
                                <ArrowDown
                                  size={12}
                                  className="text-[#8b5cf6]"
                                />
                              )
                            ) : (
                              <ArrowUpDown
                                size={12}
                                className="opacity-0 group-hover:opacity-40 transition-opacity"
                              />
                            )}
                          </span>
                        )}
                      </span>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-[14px] font-medium text-red-500">
                        Error loading employees
                      </p>
                      <p className="text-[12.5px] text-muted-foreground">
                        {error?.message || "Something went wrong"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : sortedEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-muted">
                        <Search size={24} className="text-muted-foreground" />
                      </div>
                      <p className="text-[14px] font-medium text-foreground/80">
                        No employees found
                      </p>
                      <p className="text-[12.5px] text-muted-foreground">
                        {debouncedSearch
                          ? `No results for "${debouncedSearch}"`
                          : "Try adjusting your filters"}
                      </p>
                      {debouncedSearch && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearSearch}
                          className="mt-1 text-[#8b5cf6]"
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedEmployees.map((emp) => (
                  <EmployeeRow
                    key={emp._id}
                    emp={emp}
                    selected={selectedRows.has(emp._id)}
                    onToggleSelect={toggleSelectRow}
                    onView={handleView}
                    onUpdate={handleUpdate}
                    onToggleStatus={handleToggleStatusRequest}
                    onDelete={handleDeleteRequest}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ═══════ Pagination ═══════ */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-[12.5px] text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground/80">
            {pagination.total > 0
              ? (pagination.page - 1) * pagination.limit + 1
              : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-foreground/80">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground/80">
            {pagination.total}
          </span>{" "}
          results
        </p>

        <div className="flex items-center gap-1.5">
          <PageBtn
            disabled={pagination.page <= 1}
            onClick={() => handlePageChange(1)}
            title="First page"
          >
            <ChevronsLeft size={15} />
          </PageBtn>
          <PageBtn
            disabled={pagination.page <= 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            title="Previous page"
          >
            <ChevronLeft size={15} />
          </PageBtn>

          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="text-[13px] px-1 text-muted-foreground"
              >
                …
              </span>
            ) : (
              <PageBtn
                key={p}
                active={p === pagination.page}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </PageBtn>
            ),
          )}

          <PageBtn
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
            title="Next page"
          >
            <ChevronRight size={15} />
          </PageBtn>
          <PageBtn
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.totalPages)}
            title="Last page"
          >
            <ChevronsRight size={15} />
          </PageBtn>
        </div>
      </div>

      {/* ═══════ Action Dialogs ═══════ */}
      <ViewEmployeeDialog
        employee={viewTarget}
        open={!!viewTarget}
        onOpenChange={(open) => !open && setViewTarget(null)}
      />

      <UpdateEmployeeDialog
        employee={updateTarget}
        open={!!updateTarget}
        onOpenChange={(open) => !open && setUpdateTarget(null)}
        onUpdate={handleUpdateSubmit}
      />

      <DeleteEmployeeDialog
        employee={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onDelete={handleDeleteConfirm}
      />

      <ToggleStatusDialog
        target={statusTarget}
        open={!!statusTarget}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        onConfirm={handleStatusConfirm}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   Page Button Component
   ═══════════════════════════════════════════════════════════════════ */
const PageBtn = React.memo(function PageBtn({
  children,
  active,
  disabled,
  onClick,
  title,
}) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="icon"
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={cn(
        "h-8 min-w-8 px-2 text-[13px] font-semibold",
        active &&
          "bg-[#7c3aed] hover:bg-[#6d28d9] text-white scale-105 shadow-sm",
      )}
    >
      {children}
    </Button>
  );
});

export default Employee;