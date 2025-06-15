/* eslint-disable @typescript-eslint/no-unused-vars */
import { publishProduct, unPublishProduct } from '@/app/api/product';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Switch } from '../ui/switch';
import {
  publishAllVariant,
  publishVariant,
  unPublishAllVariant,
  unPublishVariant,
} from '@/app/api/variant';

interface PublishProps {
  id: string[] | string | undefined;
  status: string | undefined;
  item: string; // 'product' | 'variant' | 'all-variant'
}

const Publish: React.FC<PublishProps> = ({ id, status, item }) => {
  const [enabled, setEnabled] = useState(false);

  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
  const accessToken =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken') || ''
      : '';

  useEffect(() => {
    setEnabled(status === 'PUBLISHED');
  }, [status]);

  const handleSwitch = async (checked: boolean) => {
    if (userId && accessToken && typeof id === 'string') {
      try {
        if (item === 'product') {
          if (checked) {
            await publishProduct(id, userId, accessToken);
            toast.success('Đã bật trạng thái đang bán cho sản phẩm!');
          } else {
            await unPublishProduct(id, userId, accessToken);
            toast.success('Đã tắt trạng thái đang bán của sản phẩm!');
          }
        } else if (item === 'variant') {
          if (checked) {
            await publishVariant(id, userId, accessToken);
            toast.success('Đã bật trạng thái đang bán cho biến thể!');
          } else {
            await unPublishVariant(id, userId, accessToken);
            toast.success('Đã tắt trạng thái đang bán của biến thể!');
          }
        } else if (item === 'all-variant') {
          if (checked) {
            await publishAllVariant(id, userId, accessToken);
            toast.success('Đã bật trạng thái đang bán cho tất cả biến thể!');
          } else {
            await unPublishAllVariant(id, userId, accessToken);
            toast.success('Đã tắt trạng thái đang bán của tất cả biến thể!');
          }
        }

        setEnabled(checked);
      } catch (error) {
        toast.error('Không thể thay đổi trạng thái.');
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

export default Publish;
