import { blockUser, unblockUser } from "@/app/api/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Switch } from "../ui/switch";

interface BlockUserProps {
  id: string;
  status: string;
  onStatusChange: (newStatus: string) => void;
}

const BlockUser: React.FC<BlockUserProps> = ({ id, status, onStatusChange }) => {
  const [enabled, setEnabled] = useState(status.toLowerCase() === "active");
  const [loading, setLoading] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    setEnabled(status.toLowerCase() === "active");
  }, [status]);

  const handleSwitch = async () => {
    if (!userId || !accessToken) return;

    setLoading(true);
    try {
      const newStatus = enabled ? "BLOCKED" : "ACTIVE";

      if (enabled) {
        await blockUser(id, userId, accessToken);
        toast.success("Người dùng đã bị chặn!");
      } else {
        await unblockUser(id, userId, accessToken);
        toast.success("Đã bỏ chặn người dùng!");
      }

      setEnabled(!enabled);
      onStatusChange(newStatus);
    } catch {
      toast.error("Không thể cập nhật trạng thái người dùng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={enabled}
        onCheckedChange={handleSwitch}
        disabled={loading}
        className={`group inline-flex h-6 w-11 items-center rounded-full transition ${
          enabled ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`size-4 transform rounded-full bg-white transition ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </Switch>
      {loading && <p className="text-gray-500 text-sm">Đang cập nhật...</p>}
    </div>
  );
};

export default BlockUser;
