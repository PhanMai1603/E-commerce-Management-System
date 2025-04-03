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
import RoleEditForm from "@/components/role/edit"; // Đảm bảo form chỉnh sửa đã có
import { Button } from "@/components/ui/button";

export function RoleTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [roleDetails, setRoleDetails] = useState<RoleDetailResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Thêm trạng thái isEditing

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const fetchRoles = useCallback(async () => {
    try {
      if (!userId || !accessToken) {
        toast.error("User authentication is required.");
        return;
      }
      const roleData = await getAllRole(userId, accessToken, 1, 10);
      setRoles(roleData.roles);
    } catch (error) {
      toast.error(get(error, "response.data.error.message", "An unknown error occurred."));
    }
  }, [userId, accessToken]);

  const fetchRoleDetails = useCallback(async (roleId: string) => {
    try {
      if (!userId || !accessToken) {
        toast.error("User authentication is required.");
        return;
      }
      const details = await getRoleDetail(roleId, userId, accessToken);
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

  const handleDelete = async (id: string) => {
    if (!userId || !accessToken) {
      toast.error("User authentication is required.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      await deleteRole(id, userId, accessToken);
      toast.success("Role deleted successfully!");
      setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
      if (selectedRole === id) {
        setSelectedRole("");
        setRoleDetails(null);
      }
    } catch (error) {
      toast.error("Failed to delete role.");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>All Roles</CardTitle>
            <Button
              onClick={() => {
                setIsCreating(true);
                setSelectedRole(""); // Xóa vai trò đã chọn
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
            </Button>
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
                    className={selectedRole === role.id ? "bg-gray-50" : "hover:bg-gray-100"}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setIsCreating(false); // Ensure creating state is false when selecting a role
                      setIsEditing(false); // Ensure we are not editing when just selecting
                    }}
                  >
                    <TableCell>{role.name}</TableCell>
                    <TableCell className="flex gap-4">
                      {role.name === "Admin" || role.name === "Basic" ? (
                        <LockKeyhole />
                      ) : (
                        <Pencil
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the table row click
                            setIsEditing(true);  // Enable editing mode
                          }}
                        />
                      )}
                      {role.name !== "Admin" && role.name !== "Basic" && (
                        <button onClick={() => handleDelete(role.id)}>
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

      <div className="col-span-2">
        {isCreating ? (
          <RoleCreationForm onRoleCreated={fetchRoles} onCancel={() => setIsCreating(false)} />
        ) : isEditing && roleDetails ? (
          <RoleEditForm
            role={roleDetails}
            onSave={fetchRoles}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <RoleDetails
            roleDetails={roleDetails}
            setModalOpen={setIsCreating} // Chuyển từ form chi tiết sang form tạo mới
          />
        )}
      </div>
    </div>
  );
}
