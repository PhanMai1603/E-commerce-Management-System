import { Order } from '@/components/dashboard/invoice'
import Sales from '@/components/dashboard/sales'
import React from 'react'

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Sales />
      </div>
      <div>
        <Order/>
      </div>
    </div>
  )
}
