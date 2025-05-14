import { ArrowDownRight, ArrowUpRight, Star } from 'lucide-react';
import React, { useState } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine
  } from 'recharts';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

  const generateData = () => {
    const data = [];
    let value = 1.25;
    for (let i = 0; i < 30; i++) {
      const change = Math.random() * 0.05 - 0.025;
      value += change;
      data.push({
        name: new Date(2025, 4, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: value
      });
    }
    return data;
  };

  const timeRangeOptions = ['1H', '1D', '1W', '1M', '1Y', 'ALL'];

  
export default function Chart() {
    const [timeRange, setTimeRange] = useState('1D');
  const [chartData, setChartData] = useState(generateData ?? []);
  const [selectedPair, setSelectedPair] = useState({ symbol: 'CR7/MOJO', name: 'Mojo token' });
  const [currentPrice, setCurrentPrice] = useState(1.25);
  const [priceChange, setPriceChange] = useState(+0.054);
  const [percentChange, setPercentChange] = useState(+4.52);

    // Custom tooltip for the chart
  const CustomTooltip = () => {
      return (
        <div className="bg-gray-800 p-2 rounded-md border border-gray-700 text-xs">
          {/* <p className="text-gray-200">hell</p> */}
          <p className="text-green-400 font-medium">$100</p>
        </div>
      )
  }

  return (
    <div>
        
        <div className="container mx-auto mt-2">
        <div className="grid grid-cols-1 gap-6">

          {/* Main Chart Section */}
          <Card className="p-4 rounded-lg">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="bg-primary-mojo h-6 w-6 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {selectedPair.symbol.substring(0, 1)}
                  </div>
                  <h2 className="text-xl font-bold">{selectedPair.symbol}</h2>
                  {/* <span className="text-gray-400">{selectedPair.symbol}</span> */}
                  <button className="text-yellow-500">
                    <Star size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center mt-2 md:mt-0">
                <span className="text-2xl font-bold">${currentPrice.toFixed(4)}</span>
                <div className={`ml-2 flex items-center ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span>${Math.abs(priceChange).toFixed(4)} ({Math.abs(percentChange).toFixed(2)}%)</span>
                </div>
              </div>
            </div>
            
            {/* Time range selector */}
            <div className="flex space-x-2 mb-4 overflow-x-auto">
              {timeRangeOptions.map((range) => (
                <Badge
                  key={range}
                  className={`px-3 py-1 rounded-md text-sm ${timeRange === range ? 'bg-primary-mojo text-white' : ''}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Badge>
              ))}
            </div>
            
            {/* Chart */}
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF" 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    // stroke="#9CA3AF" 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    className='stroke-transparent fill-transparent'
                    tickLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${value.toFixed(4)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={chartData[0]?.price} stroke="#6B7280" strokeDasharray="3 3" />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#818CF8" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: '#818CF8', stroke: '#4F46E5', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
