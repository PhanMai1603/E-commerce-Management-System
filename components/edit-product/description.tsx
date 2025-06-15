import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ProductUpdate } from '@/interface/product';

interface DescriptionFormProps {
  description: string;
  updatedProduct: ProductUpdate;
  setUpdatedProduct: React.Dispatch<React.SetStateAction<ProductUpdate>>;
}

const DescriptionForm: React.FC<DescriptionFormProps> = ({ description, updatedProduct, setUpdatedProduct }) => {
  const displayDescription = updatedProduct.description ?? description;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = event.target.value;
    const isDifferent = newDescription !== description;

    setUpdatedProduct((prev) => {
      if (isDifferent) {
        return {
          ...prev,
          description: newDescription,
        };
      } else {
        const updated = { ...prev };
        delete updated["description" as keyof ProductUpdate];
        return updated;
      }
    });
  };

  return (
    <Card className='col-span-3 flex flex-col'>
      <CardHeader>
        <CardTitle className='text-base'>Mô tả sản phẩm</CardTitle>
      </CardHeader>

      <CardContent className='flex flex-1'>
        <Textarea
          name='description'
          value={displayDescription ?? ''}
          placeholder='Nhập mô tả sản phẩm...'
          onChange={handleChange}
          className='flex-1 overflow-y-auto'
        />
      </CardContent>
    </Card>
  );
};

export default DescriptionForm;
