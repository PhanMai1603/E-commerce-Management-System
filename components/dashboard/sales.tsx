'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSale } from '@/app/api/statistics'
import { Sales } from '@/interface/statistics'
import { Skeleton } from '@/components/ui/skeleton'
import { Box, Layers, ShoppingBag, Users } from 'lucide-react'

export default function Page() {
  const [statistics, setStatistics] = useState<Sales | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : '';

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getSale(userId, accessToken);
        setStatistics(data);
      } catch (error) {
        console.error("Không thể tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && accessToken) {
      fetchStatistics();
    }
  }, [userId, accessToken]);

  return (
    <div className='grid grid-cols-4 gap-4'>
      {/* Tổng số đơn hàng */}
      <Card className='col-span-1'>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className='text-base'>Tổng đơn hàng</CardTitle>
          <ShoppingBag className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <p className='text-2xl font-bold text-primary'>{statistics?.orderCount}</p>
          )}
        </CardContent>
      </Card>

      {/* Tổng số sản phẩm */}
      <Card className='col-span-1'>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className='text-base'>Tổng sản phẩm</CardTitle>
          <Box className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <p className='text-2xl font-bold text-primary'>{statistics?.productCount}</p>
          )}
        </CardContent>
      </Card>

      {/* Tổng số người dùng */}
      <Card className='col-span-1'>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className='text-base'>Tổng người dùng</CardTitle>
          <Users className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <p className='text-2xl font-bold text-primary'>{statistics?.userCount}</p>
          )}
        </CardContent>
      </Card>

      {/* Tổng số sản phẩm đã bán */}
      <Card className='col-span-1'>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className='text-base'>Sản phẩm đã bán</CardTitle>
          <Layers className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <p className='text-2xl font-bold text-primary'>{statistics?.soldProduct}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
