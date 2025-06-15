/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { createDelivery } from '@/app/api/delivery'
import { DeliveryData, Pricing } from '@/interface/delivery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash } from 'lucide-react'

export default function Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [delivery, setDelivery] = useState<DeliveryData>({
    name: '',
    description: '',
    maxDistance: 0,
    baseFee: 0,
    pricing: [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let parsedValue = name === 'maxDistance' || name === 'baseFee' ? Number(value) || 0 : value

    if ((name === 'maxDistance' || name === 'baseFee') && typeof parsedValue === 'number' && parsedValue < 0) {
      parsedValue = 0
    }

    setDelivery((prev) => ({
      ...prev,
      [name]: parsedValue,
    }))
  }

  const handleAddPricing = () => {
    setDelivery((prev) => ({
      ...prev,
      pricing: [...prev.pricing, { threshold: 0, feePerKm: 0 }],
    }))
  }

  const handlePricingChange = (index: number, field: keyof Pricing, value: string) => {
    const newPricing = [...delivery.pricing]
    let parsedValue = Number(value) || 0
    if (parsedValue < 0) parsedValue = 0

    newPricing[index][field] = parsedValue
    setDelivery((prev) => ({ ...prev, pricing: newPricing }))
  }

  const handleRemovePricing = (index: number) => {
    const newPricing = delivery.pricing.filter((_, i) => i !== index)
    setDelivery((prev) => ({ ...prev, pricing: newPricing }))
  }

  const handleCreateDelivery = async () => {
    try {
      setLoading(true)

      const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : ""
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : ""

      await createDelivery(delivery, userId, accessToken)
      toast.success('Tạo phương thức giao hàng thành công!')
      router.push('/dashboard/delivery')
    } catch (error) {
      toast.error('Tạo phương thức giao hàng thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='grid grid-cols-2 gap-4'>
      {/* Cột trái */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Thêm phương thức giao hàng</CardTitle>
        </CardHeader>

        <CardContent className='grid grid-cols-2 gap-x-4 gap-y-6'>
          {/* Tên phương thức */}
          <div className='col-span-2'>
            <Label>Tên phương thức giao hàng</Label>
            <Input
              name='name'
              value={delivery.name}
              type='text'
              placeholder='Nhập tên phương thức giao hàng'
              onChange={handleChange}
            />
          </div>

          {/* Khoảng cách tối đa & phí cơ bản */}
          <div className='col-span-1'>
            <Label>Khoảng cách tối đa (km)</Label>
            <Input
              name='maxDistance'
              value={delivery.maxDistance}
              type='number'
              placeholder='Nhập khoảng cách tối đa'
              onChange={handleChange}
            />
          </div>
          <div className='col-span-1'>
            <Label>Phí cơ bản (VNĐ)</Label>
            <Input
              name='baseFee'
              value={delivery.baseFee}
              type='number'
              placeholder='Nhập phí cơ bản'
              onChange={handleChange}
            />
          </div>

          {/* Thêm mức phí */}
          <div className='col-span-2'>
            <Label>Thêm mức tính phí</Label>
            <Button
              onClick={handleAddPricing}
              className='w-full flex justify-center items-center bg-white rounded-md border border-dashed border-gray-400 hover:bg-gray-100 focus-visible:ring-0'>
              <Plus className='text-gray-400' /> Thêm mức tính phí
            </Button>
          </div>

          {/* Danh sách mức phí */}
          {delivery.pricing.map((tier, index) => (
            <div key={index} className='col-span-2 grid grid-cols-3 gap-4 items-end border p-2 rounded-md'>
              <div>
                <Label>Ngưỡng (Km)</Label>
                <Input
                  type='number'
                  value={tier.threshold}
                  placeholder='Nhập ngưỡng'
                  onChange={(e) => handlePricingChange(index, 'threshold', e.target.value)}
                />
              </div>

              <div>
                <Label>Phí mỗi Km (VNĐ)</Label>
                <Input
                  type='number'
                  value={tier.feePerKm}
                  placeholder='Nhập phí mỗi Km'
                  onChange={(e) => handlePricingChange(index, 'feePerKm', e.target.value)}
                />
              </div>

              <Button
                className='bg-red-500 hover:bg-red-600 text-white h-10'
                onClick={() => handleRemovePricing(index)}
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}

          {/* Nút hành động */}
          <div className='col-span-2 flex gap-4'>
            <Button
              className='flex-1 bg-gray-200 text-gray-900 hover:bg-gray-300'
              onClick={() => router.back()}
              variant='outline'
              type='button'
            >
              HỦY
            </Button>
            <Button
              className='flex-1'
              onClick={handleCreateDelivery}
              disabled={loading}
            >
              {loading ? 'ĐANG TẠO...' : 'TẠO PHƯƠNG THỨC'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cột phải */}
      <Card className='col-span-1 flex flex-col h-full'>
        <CardHeader>
          <CardTitle className='text-base'>Mô tả phương thức giao hàng</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 flex flex-col'>
          <Textarea
            name='description'
            value={delivery.description}
            placeholder='Nhập mô tả phương thức giao hàng...'
            onChange={handleChange}
            className='flex-1 h-full resize-none'
          />
        </CardContent>
      </Card>
    </div>
  )
}
