import { BarCharts } from '@/components/dashboard/barchart'
import { Chart } from '@/components/dashboard/chart'
import { Invoice } from '@/components/dashboard/invoice'
import Sales from '@/components/dashboard/sales'
import React from 'react'

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Sales />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Chart chiếm 1 cột */}
        <div className="col-span-1">
          <Chart />
        </div>

        {/* BarCharts chiếm 3 cột */}
        <div className="col-span-3">
          <BarCharts />
        </div>
      </div>

      <div>
        <Invoice/>
      </div>
    </div>
  )
}
