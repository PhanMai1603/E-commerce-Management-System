/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserData } from "@/interface/user";
import BlockUser from "@/components/user/switch";
import { assignRole } from "@/app/api/user"; // Import API
import { toast } from "react-toastify";
import { getAllRole } from "@/app/api/role";

interface EditUserModalProps {
  user: UserData;
  onClose: () => void;
  onStatusChange: (newStatus: string) => void;
  onRoleChange: (roleId: string, roleName: string) => void; // Thêm prop mới để cập nhật role trên bảng
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onStatusChange, onRoleChange }) => {
  const [isActive, setIsActive] = useState(user.status?.toUpperCase() === "ACTIVE");
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [selectedRole, setSelectedRole] = useState(user.role?.id || "");
  const [loading, setLoading] = useState(false);

  // Lấy thông tin userId và accessToken từ localStorage
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  // Fetch danh sách roles từ API
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await getAllRole(userId, accessToken, 1, 10); // Lấy 10 roles đầu tiên
        setRoles(response.roles || []);
      } catch (error) {
        toast.error("Failed to fetch roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Xử lý cập nhật trạng thái (ACTIVE / BLOCKED)
  const handleStatusChange = (newStatus: string) => {
    setIsActive(newStatus.toUpperCase() === "ACTIVE");
    onStatusChange(newStatus);
  };

  // Xử lý khi nhấn Save
  const handleSave = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setLoading(true);
    try {
      await assignRole(selectedRole, user.id, userId, accessToken);

      // Cập nhật ngay UI mà không cần reload
      const roleName = roles.find((role) => role.id === selectedRole)?.name || "Unknown";
      onRoleChange(selectedRole, roleName);

      toast.success("User role updated successfully!");
      onClose(); // Đóng modal sau khi lưu
    } catch (error) {
      toast.error("Failed to update user role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base">Edit User </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Dropdown chọn Role */}
          {/* Dropdown chọn Role */}
          <label className="block text-sm font-medium">Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="" disabled>Select role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          {/* Hiển thị trạng thái đẹp hơn */}
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mt-3">
            <span className="text-sm font-medium text-gray-600">Status</span>

            <div className="flex items-center space-x-2">
              {/* Badge trạng thái */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
              >
                {isActive ? "ACTIVE" : "BLOCKED"}
              </span>

              {/* Switch toggle để thay đổi trạng thái */}
              <BlockUser id={user.id} status={isActive ? "ACTIVE" : "BLOCKED"} onStatusChange={handleStatusChange} />
            </div>
          </div>

          {/* Nút Save và Cancel */}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
