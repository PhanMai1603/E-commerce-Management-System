/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { LockKeyhole, Pencil, Plus, Trash2 } from "lucide-react";
import { getAllRole, getRoleDetail, deleteRole } from "@/app/api/role";
import { Role, RoleDetailResponse } from "@/interface/role";
import get from "lodash/get";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleDetails from "@/components/role/detail";
import RoleCreationForm from "@/components/role/create";
import RoleEditForm from "@/components/role/edit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SearchBar from "@/components/Search";

export function RoleTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [roleDetails, setRoleDetails] = useState<RoleDetailResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string>("");

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const fetchRoles = useCallback(async () => {
    try {
      if (!userId || !accessToken) {
        toast.error("User authentication is required.");
        return;
      }
      const roleData = await getAllRole(userId, accessToken, 1, 10);
      console.log("Fetched roles:", roleData); // Debugging log
      setRoles(roleData.roles);

      if (!selectedRole) {
        const adminRole = roleData.roles.find((r) => r.name === "Admin");
        if (adminRole) {
          setSelectedRole(adminRole.id);
        }
      }
    } catch (error) {
      toast.error(get(error, "response.data.error.message", "An unknown error occurred."));
    }
  }, [userId, accessToken, selectedRole]);

  const fetchRoleDetails = useCallback(async (roleId: string) => {
    try {
      if (!userId || !accessToken) {
        toast.error("User authentication is required.");
        return;
      }
      const details = await getRoleDetail(roleId, userId, accessToken);
      console.log("Fetched role details:", details); // Debugging log
      setRoleDetails(details);
    } catch (error) {
      toast.error(get(error, "response.data.error.message", "An unknown error occurred."));
    }
  }, [userId, accessToken]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (selectedRole) {
      fetchRoleDetails(selectedRole);
    }
  }, [selectedRole, fetchRoleDetails]);

  const handleDelete = async () => {
    if (!userId || !accessToken) {
      toast.error("User authentication is required.");
      return;
    }

    try {
      await deleteRole(roleToDelete, userId, accessToken);
      toast.success("Role deleted successfully!");
      setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleToDelete));
      setIsDeleteDialogOpen(false);
      if (selectedRole === roleToDelete) {
        setSelectedRole("");
        setRoleDetails(null);
      }
    } catch (error) {
      toast.error("Failed to delete role.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Role</h1>
      <div className="grid grid-cols-3 gap-4">
        {/* Sidebar danh sách roles */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center w-full">

                <SearchBar query={""} setQuery={function (query: string): void {
                  throw new Error("Function not implemented.");
                }} />

                {/* <CardTitle>All Roles</CardTitle> */}
                <Button
                  onClick={() => {
                    setIsCreating(true);
                    setSelectedRole(""); // Clear selected role
                  }}
                  className="w-10 h-10 p-0 flex items-center justify-center rounded-md"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow
                      key={role.id}
                      className={`${role.name === "Admin" || role.name === "Basic"
                        ? "cursor-not-allowed"
                        : selectedRole === role.id
                          ? "bg-gray-50"
                          : "hover:bg-gray-100"
                        }`}
                      onClick={() => {
                        if (role.name === "Admin" || role.name === "Basic") return;
                        setSelectedRole(role.id);
                        setIsCreating(false);
                        setIsEditing(false);
                      }}
                    >
                      <TableCell>{role.name}</TableCell>
                      <TableCell className="flex gap-4">
                        {role.name === "Admin" || role.name === "Basic" ? (
                          <LockKeyhole />
                        ) : (
                          <Pencil
                            onClick={async (e) => {
                              e.stopPropagation();
                              await fetchRoleDetails(role.id);
                              setSelectedRole(role.id);
                              setTimeout(() => setIsEditing(true), 300);
                            }}
                          />
                        )}
                        {role.name !== "Admin" && role.name !== "Basic" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRoleToDelete(role.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 />
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Card hiển thị Role Details hoặc Form */}
        <div className="col-span-2">
          {isCreating ? (
            <RoleCreationForm onRoleCreated={fetchRoles} onCancel={() => setIsCreating(false)} />
          ) : isEditing && roleDetails?.id === selectedRole ? (
            <RoleEditForm
              role={roleDetails}
              onSave={async () => {
                await fetchRoles();
                await fetchRoleDetails(selectedRole);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <RoleDetails roleDetails={roleDetails} setModalOpen={setIsCreating} />
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => setIsDeleteDialogOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this role?</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleDelete}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
