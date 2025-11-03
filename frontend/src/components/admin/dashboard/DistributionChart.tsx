import React from 'react';

interface DistributionItem {
  id?: number;
  name: string;
  count: number;
  type?: string;
}

interface DistributionChartProps {
  title: string;
  data: DistributionItem[];
  loading?: boolean;
}

export function DistributionChart({ title, data, loading }: DistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-gray-500'
  ];

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {title}
          </h3>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {title}
        </h3>
        
        {data.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No hay datos disponibles
          </p>
        ) : (
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
              {data.map((item, index) => {
                const percentage = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div
                    key={item.id || item.name}
                    className={colors[index % colors.length]}
                    style={{ width: `${percentage}%` }}
                    title={`${item.name}: ${item.count} (${percentage.toFixed(1)}%)`}
                  />
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2">
              {data.map((item, index) => {
                const percentage = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={item.id || item.name} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                    <span className="text-sm text-gray-600 truncate">
                      {item.name}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {item.count}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}