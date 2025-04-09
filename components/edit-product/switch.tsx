/* eslint-disable @typescript-eslint/no-unused-vars */
import { publishProduct, unPublishProduct } from '@/app/api/product';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Switch } from '../ui/switch';

interface PublishProductProps {
  id: Array<string> | string | undefined,
  status: string | undefined,
}

const PublishProduct: React.FC<PublishProductProps> = ({ id, status }) => {
  const [enabled, setEnabled] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    setEnabled(status === 'PUBLISHED');
  }, [status]);

  const handleSwitch = async (checked: boolean) => {
    if (userId && accessToken && typeof id === 'string') {
      try {
        if (checked) {
          await publishProduct(id, userId, accessToken);
          toast.success("Published product successful!");
        } else {
          await unPublishProduct(id, userId, accessToken);
          toast.success("Unpublished product successful!");
        }
        setEnabled(checked);
      } catch (error) {
        toast.error("Failed to toggle product status.");
      }
    }
  };

  return (
    <Switch
      checked={enabled}
      onCheckedChange={handleSwitch}
    >
      {/* <span className="col-span-6 flex place-self-start" /> */}
    </Switch>
  )
}

export default PublishProduct;
