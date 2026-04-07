import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { DashboardData } from '../types';

interface ChartsProps {
  data: DashboardData;
}

export function Charts({ data }: ChartsProps) {
  const { trends } = data;

  if (!trends || trends.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      <div className="bg-white p-6 rounded-[2rem] border-none shadow-sm">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Average Salary Trend (LPA)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8A4FFF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8A4FFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontWeight: 'bold',
                  color: '#111111'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="avgSalary" 
                stroke="#8A4FFF" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSalary)" 
                name="Avg Salary (LPA)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border-none shadow-sm">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Total Placements by Year</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }}
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: '#F4F4F5' }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontWeight: 'bold',
                  color: '#111111'
                }}
              />
              <Bar 
                dataKey="totalPlacements" 
                fill="#FFC837" 
                radius={[6, 6, 0, 0]} 
                name="Students Placed"
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
