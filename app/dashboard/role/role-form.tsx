"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { LockKeyhole, Pencil, Plus, Trash2 } from "lucide-react";
import { getAllRole, getRoleDetail, deleteRole, getSearchRole } from "@/app/api/role";
import { Role, RoleDetailResponse } from "@/interface/role";
import get from "lodash/get";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
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
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [query, setQuery] = useState("");

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const fetchRoles = useCallback(async () => {
    try {
      if (!userId || !accessToken) {
        toast.error("Cần xác thực người dùng.");
        return;
      }

      const roleData = query.trim()
        ? await getSearchRole(query, userId, accessToken, page, size)
        : await getAllRole(userId, accessToken, page, size);

      setRoles(roleData.roles);
      setTotalPages(roleData.totalPages || 1);
      setTotalItems(roleData.totalRoles || roleData.roles.length);

      if (!selectedRole) {
        const adminRole = roleData.roles.find((r) => r.name === "Admin");
        if (adminRole) {
          setSelectedRole(adminRole.id);
        }
      }
    } catch (error) {
      toast.error(get(error, "response.data.error.message", "Đã xảy ra lỗi không xác định."));
    }
  }, [userId, accessToken, page, size, query, selectedRole]);

  const fetchRoleDetails = useCallback(async (roleId: string) => {
    try {
      if (!userId || !accessToken) {
        toast.error("Cần xác thực người dùng.");
        return;
      }
      const details = await getRoleDetail(roleId, userId, accessToken);
      setRoleDetails(details);
    } catch (error) {
      toast.error(get(error, "response.data.error.message", "Đã xảy ra lỗi khi lấy chi tiết."));
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
      toast.error("Cần xác thực người dùng.");
      return;
    }

    try {
      await deleteRole(roleToDelete, userId, accessToken);
      toast.success("Xoá vai trò thành công!");
      setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleToDelete));
      setIsDeleteDialogOpen(false);
      if (selectedRole === roleToDelete) {
        setSelectedRole("");
        setRoleDetails(null);
      }
    } catch (error) {
      toast.error("Xoá vai trò thất bại.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tất cả vai trò</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center w-full">
                <SearchBar
                  setQuery={(query: string) => {
                    setQuery(query);
                    setPage(1);
                  }}
                  placeholder="Tìm kiếm vai trò..."
                  width="80%"
                />
                <Button
                  onClick={() => {
                    setIsCreating(true);
                    setSelectedRole("");
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
                    <TableHead>Tên vai trò</TableHead>
                    <TableHead>Hành động</TableHead>
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

        <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => setIsDeleteDialogOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bạn có chắc muốn xoá vai trò này?</DialogTitle>
              <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outline">
                Huỷ
              </Button>
              <Button onClick={handleDelete}>Xoá</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
