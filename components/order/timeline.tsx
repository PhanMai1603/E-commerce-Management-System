import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Package, Clock, CheckCircle2, Truck, ShoppingCart } from 'lucide-react';

interface OrderTimelineProps {
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  deliveredAt?: string;
  requestedAt?: string;
  approvedAt?: string;
}

export default function OrderTimelineCard({ 
  createdAt, 
  updatedAt, 
  paidAt, 
  deliveredAt, 
  requestedAt, 
  approvedAt 
}: OrderTimelineProps) {
  // Build timeline items based on available timestamps
  const timelineItems = [];

  // Always show order creation
  timelineItems.push({
    icon: ShoppingCart,
    title: 'Order Requested',
    subtitle: requestedAt ? 'Order request submitted' : 'Order has been placed',
    date: requestedAt || createdAt,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    ringColor: 'ring-blue-200',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
    isCompleted: true,
  });

  // Show approval step if available
  if (approvedAt) {
    timelineItems.push({
      icon: CheckCircle2,
      title: 'Order Approved',
      subtitle: 'Order has been approved for processing',
      date: approvedAt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      ringColor: 'ring-purple-200',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600',
      isCompleted: true,
    });
  }

  // Show payment step if available
  if (paidAt) {
    timelineItems.push({
      icon: CheckCircle2,
      title: 'Payment Confirmed',
      subtitle: 'Payment has been successfully processed',
      date: paidAt,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      ringColor: 'ring-emerald-200',
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-emerald-600',
      isCompleted: true,
    });
  }

  // Processing step
  timelineItems.push({
    icon: Package,
    title: 'Processing',
    subtitle: deliveredAt ? 'Order was processed successfully' : 'Order is being prepared',
    date: updatedAt,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    ringColor: 'ring-amber-200',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-amber-600',
    isCompleted: !!deliveredAt,
  });

  // Delivery step
  timelineItems.push({
    icon: Truck,
    title: 'Delivered',
    subtitle: deliveredAt ? 'Order has been successfully delivered' : 'Awaiting delivery',
    date: deliveredAt || updatedAt,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    ringColor: 'ring-green-200',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-green-600',
    isCompleted: !!deliveredAt,
  });

  const completedCount = timelineItems.filter(item => item.isCompleted).length;
  const progress = (completedCount / timelineItems.length) * 100;

  return (
    <div className="col-span-3">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Order Timeline</h3>
                <p className="text-gray-600 text-sm">Track your order progress</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{completedCount}/{timelineItems.length}</div>
              <div className="text-sm text-gray-500">Steps completed</div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200" />
            
            <div className="space-y-8">
              {timelineItems.map((item, index) => {
                const IconComponent = item.icon;
                const isLast = index === timelineItems.length - 1;
                
                return (
                  <div key={index} className="relative group">
                    {/* Timeline dot */}
                    <div className={`absolute left-6 w-4 h-4 rounded-full border-4 border-white shadow-md transition-all duration-300 ${
                      item.isCompleted 
                        ? `bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo} ring-4 ${item.ringColor}` 
                        : 'bg-gray-300 ring-4 ring-gray-100'
                    }`} />
                    
                    {/* Content card */}
                    <div className="ml-16 relative">
                      <div className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${
                        item.isCompleted 
                          ? `${item.bgColor} border-transparent shadow-sm hover:shadow-md` 
                          : 'bg-white border-gray-200 opacity-75'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              item.isCompleted ? `bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo}` : 'bg-gray-200'
                            }`}>
                              <IconComponent className={`w-5 h-5 ${
                                item.isCompleted ? 'text-white' : 'text-gray-400'
                              }`} />
                            </div>
                            <div>
                              <h4 className={`font-bold text-lg ${
                                item.isCompleted ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {item.title}
                              </h4>
                              <p className={`text-sm ${
                                item.isCompleted ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            item.isCompleted
                              ? 'bg-green-100 text-green-800 ring-1 ring-green-200'
                              : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
                          }`}>
                            {item.isCompleted ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                Completed
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                Pending
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                            item.isCompleted ? 'bg-white/70' : 'bg-gray-50'
                          }`}>
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-800">
                              {new Date(item.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: '2-digit', 
                                year: 'numeric' 
                              })}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">
                              {new Date(item.date).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                hour12: false 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Connecting line to next item */}
                      {!isLast && (
                        <div className="absolute left-4 top-full w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  {/* <div className="text-2xl font-bold text-gray-900">{timelineItems.length}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Total Steps</div> */}
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                {/* <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Completed</div>
                </div> */}
              </div>
              
              <div className="text-right">
                {deliveredAt ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    Order Completed
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-semibold">
                    <Clock className="w-5 h-5 animate-pulse" />
                    In Progress
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}