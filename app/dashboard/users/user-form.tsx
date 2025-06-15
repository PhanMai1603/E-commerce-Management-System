"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";
import { getAllUser, getSearchUser } from "@/app/api/user";
import { UserData } from "@/interface/user";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditUserModal from "@/components/user/edit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchBar from "@/components/Search";

export function UserTable() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [query, setQuery] = useState("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = query.trim()
          ? await getSearchUser(userId, accessToken, page, size, query)
          : await getAllUser(userId, accessToken, page, size);

        setUsers(response.items);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);
      } catch (error) {
        toast.error("Không thể tải danh sách người dùng");
      }
    };

    fetchUsers();
  }, [userId, accessToken, page, size, query]);

  const updateUserStatus = (userId: string, newStatus: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleStatusChange = (newStatus: string) => {
    if (selectedUser) {
      updateUserStatus(selectedUser.id, newStatus);
    }
  };

  const handleRoleChange = (userId: string, roleId: string, roleName: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === userId ? { ...u, role: { id: roleId, name: roleName } } : u
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tất cả người dùng</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">
                Hiển thị:
              </label>
              <Select
                value={size.toString()}
                onValueChange={(val) => {
                  setSize(Number(val));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 rounded-md px-3 py-2 text-sm">
                  <SelectValue placeholder="Chọn số dòng" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 25, 50, 100].map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SearchBar
              setQuery={(newQuery: string) => {
                setQuery(newQuery);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell className="font-medium">{user.role?.name || "Không rõ"}</TableCell>
                    <TableCell className="font-medium">
                      <span
                        className={`inline-block py-1 px-3 rounded-full text-sm font-semibold ${
                          user.status?.toUpperCase() === "ACTIVE"
                            ? "bg-[#22C55E29] text-[#118D57]"
                            : user.status?.toUpperCase() === "BLOCKED"
                            ? "bg-[#FF563029] text-[#B71D18]"
                            : "bg-[#919EAB29] text-[#637381]"
                        }`}
                      >
                        {user.status === "ACTIVE"
                          ? "Hoạt động"
                          : user.status === "BLOCKED"
                          ? "Bị chặn"
                          : "Không rõ"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-md"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowModal(true);
                            }}
                          >
                            <EllipsisVertical />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setShowModal(true);
                            }}
                          >
                            Chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    Không tìm thấy người dùng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="border-t pt-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => Math.max(prev - 1, 1));
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>

        {showModal && selectedUser && (
          <EditUserModal
            user={selectedUser}
            onClose={() => setShowModal(false)}
            onStatusChange={handleStatusChange}
            onRoleChange={(roleId, roleName) =>
              handleRoleChange(selectedUser.id, roleId, roleName)
            }
          />
        )}
      </Card>
    </div>
  );
}
