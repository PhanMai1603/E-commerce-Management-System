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
        console.error("Failed to fetch statistics:", error);
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
      {/* Total Orders */}
      <Card className='col-span-1'>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className='text-base'>Total Orders</CardTitle>
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

      {/* Total Products */}
      <Card className='col-span-1'>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className='text-base'>Total Products</CardTitle>
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

      {/* Total Users */}
      <Card className='col-span-1'>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className='text-base'>Total Users</CardTitle>
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

      {/* Total Sold Products */}
      <Card className='col-span-1'>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className='text-base'>Sold Products</CardTitle>
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
