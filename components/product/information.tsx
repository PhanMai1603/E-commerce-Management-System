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
        <CardTitle className='text-base'>Thông tin sản phẩm</CardTitle>
      </CardHeader>

      <CardContent className='grid grid-cols-6 gap-x-6 gap-y-8'>
        <div className='space-y-2 col-span-6'>
          <Label>URL video giới thiệu</Label>
          <Input
            name='video'
            value={product.video}
            type='text'
            placeholder='Nhập đường dẫn video'
            onChange={handleChange}
          />
        </div>

        <div className='space-y-2 col-span-6'>
          <Label>Tên sản phẩm</Label>
          <Input
            name='name'
            value={product.name}
            type='text'
            placeholder='Nhập tên sản phẩm'
            onChange={handleChange}
          />
        </div>

        <div className='w-full space-y-2 col-span-6'>
          <Label>Danh mục sản phẩm</Label>
          <CategorySelection setProduct={setProduct} />
        </div>

        <div className='space-y-2 col-span-4'>
          <Label>Giá gốc</Label>
          <Input
            name='originalPrice'
            value={product.originalPrice}
            type='number'
            min="0"
            placeholder='Nhập giá gốc'
            onChange={handleChange}
          />
        </div>

        <div className='space-y-2 col-span-2'>
          <Label>Số ngày hoàn trả</Label>
          <Select onValueChange={(value) => handleSelect(value)}>
            <SelectTrigger className='flex h-10 hover:bg-gray-600/10'>
              <SelectValue placeholder="Chọn số ngày" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="0">Không cho đổi trả</SelectItem>
                <SelectItem value="7">7 ngày</SelectItem>
                <SelectItem value="14">14 ngày</SelectItem>
                <SelectItem value="30">30 ngày</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2 col-span-6'>
          <Label>Thuộc tính sản phẩm</Label>
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
