import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CouponData } from "@/interface/coupon";

interface DescriptionCouponFormProps {
  description: string;
  setCoupon: React.Dispatch<React.SetStateAction<CouponData>>; // Đổi `setProduct` thành `setCoupon`
}

const DescriptionCouponForm: React.FC<DescriptionCouponFormProps> = ({ description, setCoupon }) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = event.target.value;

    setCoupon((prev) => ({
      ...prev,
      description: newDescription,
    }));
  };

  return (
    <Card className="col-span-2 flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">Add Coupon Description</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1">
        <Textarea
          name="description"
          value={description}
          placeholder="Enter coupon description..."
          onChange={handleChange}
          className="flex-1 overflow-y-auto"
        />
      </CardContent>
    </Card>
  );
};

export default DescriptionCouponForm;
