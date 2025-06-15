import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ProductData } from '@/interface/product';

interface DescriptionFormProps {
  description: string,
  setProduct: React.Dispatch<React.SetStateAction<ProductData>>;
}

const DescriptionForm: React.FC<DescriptionFormProps> = ({ description, setProduct }) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = event.target.value;

    setProduct((prev) => ({
      ...prev,
      description: newDescription,
    }));
  };

  return (
    <Card className='col-span-3 flex flex-col'>
      <CardHeader>
        <CardTitle className='text-base'>Mô tả sản phẩm</CardTitle>
      </CardHeader>

      <CardContent className='flex flex-1'>
        <Textarea
          name='description'
          value={description}
          placeholder='Nhập mô tả sản phẩm...'
          onChange={handleChange}
          className='flex-1 overflow-y-auto'
        />
      </CardContent>
    </Card>
  )
}

export default DescriptionForm;
