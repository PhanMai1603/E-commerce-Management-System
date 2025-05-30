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

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue = name === 'maxDistance' || name === 'baseFee' ? Number(value) || 0 : value;

    // Nếu là số và là các trường maxDistance hoặc baseFee, đảm bảo giá trị không âm
    if ((name === 'maxDistance' || name === 'baseFee') && typeof parsedValue === 'number' && parsedValue < 0) {
      parsedValue = 0; // Đặt lại giá trị nếu nhập số âm
    }

    setDelivery((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };


  // Thêm Pricing Tier mới
  const handleAddPricing = () => {
    setDelivery((prev) => ({
      ...prev,
      pricing: [...prev.pricing, { threshold: 0, feePerKm: 0 }],
    }))
  }


  // Cập nhật giá trị của Pricing Tier
  const handlePricingChange = (index: number, field: keyof Pricing, value: string) => {
    const newPricing = [...delivery.pricing]

    // Chuyển giá trị nhập vào thành số
    let parsedValue = Number(value) || 0;

    // Nếu giá trị âm, đặt lại thành 0
    if (parsedValue < 0) {
      parsedValue = 0;
    }

    // Cập nhật giá trị vào pricing
    newPricing[index][field] = parsedValue;
    setDelivery((prev) => ({ ...prev, pricing: newPricing }));
  }

  // Xóa Pricing Tier
  const handleRemovePricing = (index: number) => {
    const newPricing = delivery.pricing.filter((_, i) => i !== index)
    setDelivery((prev) => ({ ...prev, pricing: newPricing }))
  }

  // Gửi dữ liệu lên API
  const handleCreateDelivery = async () => {
    try {
      setLoading(true)

      const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      await createDelivery(delivery, userId, accessToken)
      toast.success('Delivery created successfully!')
      router.push('/dashboard/delivery')
    } catch (error) {
      // toast.error('Failed to create delivery')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='grid grid-cols-2 gap-4'>
      {/* Cột trái */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Add Delivery Information</CardTitle>
        </CardHeader>

        <CardContent className='grid grid-cols-2 gap-x-4 gap-y-6'>
          {/* Delivery Name */}
          <div className='col-span-2'>
            <Label>Delivery Name</Label>
            <Input
              name='name'
              value={delivery.name}
              type='text'
              placeholder='Enter delivery name'
              onChange={handleChange}
            />
          </div>

          {/* Max Distance & Base Fee trên cùng một dòng */}
          <div className='col-span-1'>
            <Label>Max Distance (km)</Label>
            <Input
              name='maxDistance'
              value={delivery.maxDistance}
              type='number'
              placeholder='Enter max distance'
              onChange={handleChange}
            />
          </div>
          <div className='col-span-1'>
            <Label>Base Fee</Label>
            <Input
              name='baseFee'
              value={delivery.baseFee}
              type='number'
              placeholder='Enter base fee'
              onChange={handleChange}
            />
          </div>

          {/* Add Pricing Tier */}
          <div className='col-span-2'>
            <Label>Add Price Tier</Label>
            <Button
              onClick={handleAddPricing}
              className='w-full flex justify-center items-center bg-white rounded-md border border-dashed border-gray-400 hover:bg-gray-100 focus-visible:ring-0'>
              <Plus className='text-gray-400' /> Add Pricing Tier
            </Button>
          </div>

          {/* Danh sách Pricing Tier */}
          {delivery.pricing.map((tier, index) => (
            <div key={index} className='col-span-2 grid grid-cols-3 gap-4 items-end border p-2 rounded-md'>
              {/* Threshold */}
              <div>
                <Label>Threshold(Km)</Label>
                <Input
                  type='number'
                  value={tier.threshold}
                  placeholder='Enter threshold'
                  onChange={(e) => handlePricingChange(index, 'threshold', e.target.value)}
                />
              </div>

              {/* Fee Per Km */}
              <div>
                <Label>Fee Per Km</Label>
                <Input
                  type='number'
                  value={tier.feePerKm}
                  placeholder='Enter fee per km'
                  onChange={(e) => handlePricingChange(index, 'feePerKm', e.target.value)}
                />
              </div>

              {/* Trash Button */}
              <Button
                className='bg-red-500 hover:bg-red-600 text-white h-10'
                onClick={() => handleRemovePricing(index)}
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}


          {/* Submit Button */}
          <div className='col-span-2 flex gap-4'>
            <Button
              className='flex-1 bg-gray-200 text-gray-900 hover:bg-gray-300'
              onClick={() => router.back()}
              variant='outline'
              type='button'
            >
              CANCEL
            </Button>
            <Button
              className='flex-1'
              onClick={handleCreateDelivery}
              disabled={loading}
            >
              {loading ? 'CREATING...' : 'CREATE DELIVERY'}
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Cột phải */}
      <Card className='col-span-1 flex flex-col h-full'>
        <CardHeader>
          <CardTitle className='text-base'>Add Delivery Description</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 flex flex-col'>
          <Textarea
            name='description'
            value={delivery.description}
            placeholder='Enter delivery description...'
            onChange={handleChange}
            className='flex-1 h-full resize-none'
          />
        </CardContent>
      </Card>
    </div>
  )
}
