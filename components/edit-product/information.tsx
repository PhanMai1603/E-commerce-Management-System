'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProductDetail, ProductUpdate } from '@/interface/product'
import CategorySelection from './information/category'
import AttributeForm from './information/attribute'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import Publish from './switch'

interface InformationFormProps {
  product: ProductDetail,
  updatedProduct: ProductUpdate,
  setUpdatedProduct: React.Dispatch<React.SetStateAction<ProductUpdate>>,
  userId: string,
  accessToken: string,
}

const InformationForm: React.FC<InformationFormProps> = ({ product, updatedProduct, setUpdatedProduct, userId, accessToken }) => {
  const displayProduct = { ...product, ...updatedProduct };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let newValue = name === 'name' || name === 'video' ? value : (value === "" ? "" : Number(value));

    const originalValue = product[name as keyof ProductDetail];

    if (name !== 'name' && name !== 'video' && Number(newValue) < 0) {
      newValue = "0";
    }

    setUpdatedProduct((prev) => {
      const isDifferent =
        typeof originalValue === 'number'
          ? Number(newValue) !== originalValue
          : newValue !== originalValue;

      if (isDifferent) {
        return {
          ...prev,
          [name]: newValue,
        }
      } else {
        const updated = { ...prev };
        delete updated[name as keyof ProductUpdate];
        return updated;
      }
    });
  }

  const handleValueChange = (value: string) => {
    const isDifferent = Number(value) !== product["returnDays" as keyof ProductDetail];

    setUpdatedProduct((prev) => {
      if (isDifferent) {
        return {
          ...prev,
          returnDays: Number(value),
        }
      } else {
        const updated = { ...prev };
        delete updated["returnDays" as keyof ProductUpdate];
        return updated;
      }
    });
  }

  return (
    <Card className='col-span-3'>
      <CardHeader>
        <CardTitle className='text-base'>Edit Product Information</CardTitle>
      </CardHeader>

      <CardContent className='grid grid-cols-6 gap-x-6 gap-y-8'>
        <div className='space-y-2 col-span-6'>
          <Label>Video URL</Label>
          <Input
            name='video'
            value={displayProduct.video ?? ''}
            type='text'
            placeholder='Enter video url'
            onChange={handleChange}
          />
        </div>

        <div className='space-y-2 col-span-6'>
          <Label>Product Name</Label>
          <Input
            name='name'
            value={displayProduct.name ?? ''}
            type='text'
            placeholder='Enter product name'
            onChange={handleChange}
          />
        </div>

        <div className='w-full space-y-2 col-span-6'>
          <Label>Product Categories</Label>
          <CategorySelection
            product={product}
            setUpdatedProduct={setUpdatedProduct}
          />
        </div>

        <div className='space-y-2 col-span-4'>
          <Label>Product Original Price</Label>
          <Input
            name='originalPrice'
            value={displayProduct.originalPrice ?? ''}
            type='number'
            min="0"
            placeholder='Enter product original price'
            onChange={handleChange}
          />
        </div>

        <div className='space-y-2 col-span-2'>
          <Label>Product Return Day</Label>
          <Select
            value={String(displayProduct.returnDays ?? '')} // Convert number to string for Select
            onValueChange={handleValueChange}
          >
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
            setUpdatedProduct={setUpdatedProduct}
            userId={userId}
            accessToken={accessToken}
          />
        </div>

        <div className='space-x-4 col-span-6 flex justify-end items-center'>
          <Label>Publish Product</Label>
          <Publish
            id={product.id}
            status={product.status}
            item="product"
          />
        </div>
      </CardContent>
    </Card >
  )
}

export default InformationForm;
