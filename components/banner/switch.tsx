/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Switch } from '@/components/ui/switch';
import { publishBanner, unPublishBanner } from '@/app/api/banner';

interface PublishBannerProps {
  id: string | undefined;
  isActive: boolean | undefined;
  onChanged?: () => void;
}

const PublishBanner: React.FC<PublishBannerProps> = ({ id, isActive, onChanged }) => {
  const [enabled, setEnabled] = useState(false);

  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
  const accessToken =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken') || ''
      : '';

  useEffect(() => {
    setEnabled(!!isActive); // đảm bảo là boolean
  }, [isActive]);

  const handleSwitch = async (checked: boolean) => {
    if (userId && accessToken && typeof id === 'string') {
      try {
        if (checked) {
          await publishBanner(id, userId, accessToken);
          toast.success('Banner đã được hiển thị!');
        } else {
          await unPublishBanner(id, userId, accessToken);
          toast.success('Banner đã được ẩn!');
        }
        setEnabled(checked);
        onChanged && onChanged(); // callback reload lại chi tiết
      } catch (error) {
        toast.error('Không thể thay đổi trạng thái banner!');
      }
    }
  };

  return (
    <Switch
      disabled={!id}
      checked={enabled}
      onCheckedChange={handleSwitch}
    />
  );
};

export default PublishBanner;
