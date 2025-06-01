import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { format } from 'date-fns';
import { Package, Clock, CheckCircle2 } from 'lucide-react';

interface OrderTimelineProps {
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string | null;
}

export default function OrderTimelineCard({ createdAt, updatedAt, deliveredAt }: OrderTimelineProps) {
  const timelineItems = [
    {
      icon: Package,
      title: 'Order Date',
      date: createdAt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      status: 'completed',
      isCompleted: true
    },
    {
      icon: Clock,
      title: 'Last Updated',
      date: updatedAt,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      status: 'active',
      isCompleted: !!deliveredAt
    },
    ...(deliveredAt ? [{
      icon: CheckCircle2,
      title: 'Delivered',
      date: deliveredAt,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      status: 'completed',
      isCompleted: true
    }] : [])
  ];

  return (
    <div className="col-span-3">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Order Timeline</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-amber-200 to-green-200" />
            
            <div className="space-y-6">
              {timelineItems.map((item, index) => {
                const IconComponent = item.icon;
                
                return (
                  <div key={index} className="relative flex items-start gap-4">
                    {/* Timeline dot */}
                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                      item.isCompleted 
                        ? `${item.bgColor} border-4 border-white shadow-sm` 
                        : 'bg-gray-100 border-4 border-white shadow-sm'
                    }`}>
                      {item.isCompleted ? (
                        <div className="relative">
                          <IconComponent className={`w-5 h-5 ${item.color}`} />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-2 h-2 text-white" />
                          </div>
                        </div>
                      ) : (
                        <IconComponent className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-6">
                      <div className={`bg-white rounded-lg p-4 shadow-sm border transition-all duration-200 ${
                        item.isCompleted 
                          ? 'border-green-200 hover:shadow-md hover:border-green-300' 
                          : 'border-gray-200 hover:shadow-md opacity-70'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-semibold ${item.isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                            {item.title}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.isCompleted
                              ? item.title === 'Delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : item.title === 'Last Updated' && deliveredAt
                                  ? 'bg-green-100 text-green-800'
                                  : item.title === 'Last Updated'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {item.isCompleted ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Completed
                              </div>
                            ) : (
                              'Pending'
                            )}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${item.isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">
                            {format(new Date(item.date), 'MMM dd, yyyy')}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>
                            {format(new Date(item.date), 'HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Summary footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Total timeline events: <span className="font-medium text-gray-900">{timelineItems.length}</span>
              </span>
              {deliveredAt ? (
                <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Order Completed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                  <Clock className="w-4 h-4" />
                  In Progress
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}