'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProductData } from '@/interface/product'
import CategorySelection from './information/category'
import AttributeForm from './information/attribute'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface InformationFormProps {
  userId: string,
  accessToken: string,
  product: ProductData,
  setProduct: React.Dispatch<React.SetStateAction<ProductData>>;
}

const InformationForm: React.FC<InformationFormProps> = ({ product, setProduct, userId, accessToken }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let newValue = value;

    if (name !== 'name' && name !== 'video' && Number(value) < 0) {
      newValue = "0";
    }

    setProduct((prev) => ({
      ...prev,
      [name]: name === 'name' || name === 'video' ? newValue : (newValue === "" ? "" : Number(newValue)),
    }));
  }

  const handleSelect = (value: string) => {
    setProduct((prev) => ({
      ...prev,
      returnDays: Number(value),
    }));
  }

  return (
    <Card className='col-span-3'>
      <CardHeader>
        <CardTitle className='text-base'>Add Product Information</CardTitle>
      </CardHeader>

      <CardContent className='grid grid-cols-6 gap-x-6 gap-y-8'>
        <div className='space-y-2 col-span-6'>
          <Label>Video URL</Label>
          <Input
            name='video'
            value={product.video}
            type='text'
            placeholder='Enter video url'
            onChange={handleChange}
          />
        </div>

        <div className='space-y-2 col-span-6'>
          <Label>Product Name</Label>
          <Input
            name='name'
            value={product.name}
            type='text'
            placeholder='Enter product name'
            onChange={handleChange}
          />
        </div>

        <div className='w-full space-y-2 col-span-6'>
          <Label>Product Categories</Label>
          <CategorySelection setProduct={setProduct} />
        </div>

        <div className='space-y-2 col-span-4'>
          <Label>Product Original Price</Label>
          <Input
            name='originalPrice'
            value={product.originalPrice}
            type='number'
            min="0"
            placeholder='Enter product original price'
            onChange={handleChange}
          />
        </div>

        <div className='space-y-2 col-span-2'>
          <Label>Product Return Day</Label>
          <Select onValueChange={(value) => handleSelect(value)}>
            <SelectTrigger className='flex h-10 hover:bg-gray-600/10'>
              <SelectValue placeholder="Select return day" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="0">0 day</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2 col-span-6'>
          <Label>Product Attributes</Label>
          <AttributeForm
            product={product}
            setProduct={setProduct}
            userId={userId}
            accessToken={accessToken}
          />
        </div>
      </CardContent>
    </Card >
  )
}

export default InformationForm;
