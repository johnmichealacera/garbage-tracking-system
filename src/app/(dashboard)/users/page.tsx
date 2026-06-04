"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import {
  Eye,
  EyeOff,
  Plus,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { StatusTone } from "@/components/dashboard/status-badge";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DISPATCHER" | "DRIVER";
  isActive: boolean;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function roleTone(role: string): StatusTone {
  if (role === "ADMIN") return "danger";
  if (role === "DISPATCHER") return "info";
  return "success";
}

function roleLabel(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UsersPage() {
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  const { data, isLoading } = useSWR<UserRow[]>("/api/users", fetcher);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"DRIVER" | "DISPATCHER" | "ADMIN">("DRIVER");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function resetForm() {
    setName("");
    setEmail("");
    setRole("DRIVER");
    setPassword("");
    setShowPassword(false);
  }

  function openModal() {
    resetForm();
    setShowModal(true);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message ?? "Failed to create account.");
        return;
      }
      mutate("/api/users");
      toast.success(`Account created for ${json.name}.`);
      setShowModal(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleActive(user: UserRow) {
    if (user.id === currentUserId) {
      toast.error("You cannot deactivate your own account.");
      return;
    }
    setTogglingId(user.id);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message ?? "Failed to update account.");
        return;
      }
      mutate("/api/users");
      toast.success(
        json.isActive
          ? `${json.name} has been activated.`
          : `${json.name} has been deactivated.`,
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message ?? "Failed to delete account.");
        return;
      }
      mutate("/api/users");
      toast.success(`${deleteTarget.name}'s account has been deleted.`);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const counts = {
    total: data?.length ?? 0,
    admin: data?.filter((u) => u.role === "ADMIN").length ?? 0,
    dispatcher: data?.filter((u) => u.role === "DISPATCHER").length ?? 0,
    driver: data?.filter((u) => u.role === "DRIVER").length ?? 0,
    inactive: data?.filter((u) => !u.isActive).length ?? 0,
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Admin"
        icon={<Users className="size-5" />}
        title="User accounts"
        description="Manage system accounts for administrators, dispatchers, and drivers."
        actions={
          <Button onClick={openModal} className="gap-2 shadow-md">
            <Plus className="size-4" />
            New account
          </Button>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total accounts", value: counts.total, icon: <Users className="size-4" />, tone: "text-foreground" },
          { label: "Admins", value: counts.admin, icon: <ShieldCheck className="size-4" />, tone: "text-rose-600 dark:text-rose-400" },
          { label: "Dispatchers", value: counts.dispatcher, icon: <UserCog className="size-4" />, tone: "text-sky-600 dark:text-sky-400" },
          { label: "Drivers", value: counts.driver, icon: <Users className="size-4" />, tone: "text-emerald-600 dark:text-emerald-400" },
        ].map((s) => (
          <Card
            key={s.label}
            className="border-border/70 bg-card/85 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
          >
            <CardContent className="flex items-center justify-between gap-2 p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                {isLoading ? (
                  <Skeleton className="mt-1 h-7 w-10" />
                ) : (
                  <p className={`mt-0.5 text-2xl font-semibold tabular-nums ${s.tone}`}>
                    {s.value}
                  </p>
                )}
              </div>
              <div className={`shrink-0 ${s.tone}`}>{s.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users table */}
      <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold tracking-tight">
            All accounts
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {counts.inactive > 0
              ? `${counts.inactive} deactivated account${counts.inactive > 1 ? "s" : ""} — deactivated users cannot sign in.`
              : "All accounts are currently active."}
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : !data?.length ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="size-5" />
              </div>
              <p className="mt-3 text-sm font-medium">No accounts yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create the first account using the button above.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border/60">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2.5 text-left">Name</th>
                      <th className="px-4 py-2.5 text-left">Email</th>
                      <th className="px-4 py-2.5 text-left">Role</th>
                      <th className="px-4 py-2.5 text-left">Status</th>
                      <th className="px-4 py-2.5 text-left">Created</th>
                      <th className="px-4 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/20"
                      >
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-teal-500/20 text-[11px] font-semibold text-primary ring-1 ring-primary/20">
                              {initials(user.name)}
                            </div>
                            <span className="font-medium">{user.name}</span>
                            {user.id === currentUserId && (
                              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                you
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <StatusBadge
                            label={roleLabel(user.role)}
                            tone={roleTone(user.role)}
                          />
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <StatusBadge
                            label={user.isActive ? "Active" : "Inactive"}
                            tone={user.isActive ? "success" : "neutral"}
                          />
                        </td>
                        <td className="px-4 py-3 align-middle text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString("en-PH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-right align-middle">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant={user.isActive ? "outline" : "default"}
                              disabled={
                                togglingId === user.id ||
                                user.id === currentUserId
                              }
                              onClick={() => toggleActive(user)}
                              className="text-xs"
                            >
                              {togglingId === user.id
                                ? "Saving…"
                                : user.isActive
                                  ? "Deactivate"
                                  : "Activate"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={user.id === currentUserId}
                              onClick={() => setDeleteTarget(user)}
                              className="size-8 p-0 text-destructive hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
                              aria-label={`Delete ${user.name}`}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border/70 bg-card/95 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight">
                  Delete account
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-medium text-foreground">
                    {deleteTarget.name}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-amber-500/25 bg-amber-500/8 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
              Accounts with existing pickup logs cannot be deleted. Use
              <span className="font-semibold"> Deactivate </span>
              instead to block sign-in while preserving records.
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-2"
              >
                <Trash2 className="size-4" />
                {isDeleting ? "Deleting…" : "Delete account"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create account modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card/95 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                <UserCog className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  New account
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  The new user can sign in immediately with these credentials.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="u-name">Full name</Label>
                <Input
                  id="u-name"
                  placeholder="e.g. Juan Dela Cruz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-10 bg-background/80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="u-email">Email address</Label>
                <Input
                  id="u-email"
                  type="email"
                  placeholder="e.g. juan@socorro.gov.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 bg-background/80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="u-role">Role</Label>
                <select
                  id="u-role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "DRIVER" | "DISPATCHER" | "ADMIN")
                  }
                  className="h-10 w-full rounded-md border border-input bg-background/80 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="DRIVER">Driver — field collection worker</option>
                  <option value="DISPATCHER">Dispatcher — creates and assigns routes</option>
                  <option value="ADMIN">Admin — full system access</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="u-password">Password</Label>
                <div className="relative">
                  <Input
                    id="u-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-10 bg-background/80 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Share this with the new user so they can sign in.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 shadow-md"
                >
                  <UserCog className="size-4" />
                  {isSubmitting ? "Creating…" : "Create account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
