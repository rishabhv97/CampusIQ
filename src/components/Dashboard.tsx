import React, { useState } from 'react';
import { LayoutDashboard, FileUp, MessageSquare, TrendingUp, Briefcase, GraduationCap, Users, ArrowLeft, Info, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { Charts } from './Charts';
import { Chat } from './Chat';
import { PreparationPlan } from './PreparationPlan';
import { DashboardData, ChatMessage } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PLACEMENT_DATA } from '../constants/mockData';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(MOCK_PLACEMENT_DATA);
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'prep'>('overview');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleDataExtracted = (newData: DashboardData) => {
    setData(newData);
    setActiveTab('overview');
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#F4F4F5] font-sans">
      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-6xl bg-white rounded-full shadow-sm z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 pl-2">
          <div className="w-8 h-8 bg-[#FFC837] rounded-lg flex items-center justify-center text-[#111111]">
            <GraduationCap size={20} className="fill-current" />
          </div>
          <h1 className="font-black text-xl tracking-tight text-[#111111]">Placement.</h1>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "text-sm font-bold transition-colors",
              activeTab === 'overview' ? "text-[#111111]" : "text-gray-400 hover:text-[#111111]"
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('prep')}
            className={cn(
              "text-sm font-bold transition-colors",
              activeTab === 'prep' ? "text-[#111111]" : "text-gray-400 hover:text-[#111111]"
            )}
          >
            Prep Plan
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              "text-sm font-bold transition-colors",
              activeTab === 'chat' ? "text-[#111111]" : "text-gray-400 hover:text-[#111111]"
            )}
          >
            Ask Gemini
          </button>
        </div>
        
        <div>
          <FileUpload onDataExtracted={handleDataExtracted} compact={true} existingRecords={data.records} />
        </div>
      </nav>

      <main className="pt-32 pb-12 px-6 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              {/* Header Section */}
              <div className="text-center mb-16 mt-8">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-[#111111] mb-6 leading-tight">
                  Placement Analytics <br/>
                  <span className="relative inline-block">
                    with Style
                    <svg className="absolute w-full h-6 -bottom-3 left-0 text-[#FFC837]" viewBox="0 0 200 20" preserveAspectRatio="none">
                      <path d="M5 15 Q 100 5 195 15 M 15 18 Q 100 8 185 18" stroke="currentColor" strokeWidth="3" fill="transparent" strokeLinecap="round"/>
                    </svg>
                  </span>
                </h2>
                <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">Comprehensive insights from the last 5 years of hiring trends. Upload your reports to see the magic.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Partner Companies", value: data.records.length, icon: <Briefcase size={24} />, color: "bg-[#8A4FFF] text-white", trend: "+12% vs last year" },
                  { label: "Total Placements", value: data.trends.reduce((acc, curr) => acc + curr.totalPlacements, 0), icon: <Users size={24} />, color: "bg-[#FFC837] text-[#111111]", trend: "84% success rate" },
                  { label: "Highest Package", value: "18.5 LPA", icon: <TrendingUp size={24} />, color: "bg-[#111111] text-white", trend: "New record set" },
                  { label: "Avg. Salary (LPA)", value: (data.records.reduce((acc, curr) => acc + curr.salaryLPA, 0) / data.records.length).toFixed(1), icon: <LayoutDashboard size={24} />, color: "bg-white text-[#111111]", trend: "Steady growth" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group border-none"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
                        {stat.icon}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.trend}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-4xl font-black text-[#111111] mt-1 tracking-tight">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary Card */}
              <div className="relative overflow-hidden bg-[#FFC837] p-10 rounded-[2rem] shadow-sm border-none">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-2xl font-black text-[#111111] tracking-tight">AI Intelligence Report</h3>
                  </div>
                  <p className="text-[#111111] text-xl font-medium leading-relaxed max-w-4xl">
                    {data.summary}
                  </p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="space-y-6 bg-white p-8 rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#8A4FFF] flex items-center justify-center text-white">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-[#111111] tracking-tight">Growth & Volume Trends</h3>
                </div>
                <Charts data={data} />
              </div>

              {/* Recent Companies Table */}
              <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border-none">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white">
                      <Briefcase size={20} />
                    </div>
                    <h3 className="text-2xl font-black text-[#111111] tracking-tight">Hiring Partners</h3>
                  </div>
                  <button className="text-sm font-bold text-[#8A4FFF] hover:text-[#7A3EEF] transition-colors">View all records</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Company</th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Year</th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Target Branches</th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Package (LPA)</th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Offers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.records.map((record, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <img 
                                src={`https://logo.clearbit.com/${record.companyName.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '')}.com`}
                                alt={record.companyName}
                                className="w-10 h-10 rounded-xl object-contain bg-white border border-gray-100 shadow-sm p-1"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(record.companyName)}&background=8A4FFF&color=fff&bold=true&font-size=0.4`;
                                }}
                              />
                              <span className="font-bold text-[#111111]">{record.companyName}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                              {record.year}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-wrap gap-2">
                              {record.branches.map((b, i) => (
                                <span key={i} className="px-3 py-1 bg-[#F4F4F5] text-[#111111] rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                  {b}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-black text-[#111111]">{record.salaryLPA}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                                <div 
                                  className="h-full bg-[#8A4FFF] rounded-full" 
                                  style={{ width: `${Math.min(100, (record.numberOfStudentsPlaced / 100) * 100)}%` }} 
                                />
                              </div>
                              <span className="text-sm font-bold text-gray-600">{record.numberOfStudentsPlaced}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'prep' ? (
            <motion.div
              key="prep"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-10 text-center">
                <h2 className="text-5xl font-black text-[#111111] tracking-tighter mb-4">Preparation Plans</h2>
                <p className="text-lg text-gray-500 font-medium">Detailed guides for top recruiters based on historical campus data.</p>
              </div>
              <PreparationPlan data={data} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-10 text-center">
                <h2 className="text-5xl font-black text-[#111111] tracking-tighter mb-4">Placement Assistant</h2>
                <p className="text-lg text-gray-500 font-medium">Ask anything about the hiring data using natural language.</p>
              </div>
              <Chat data={data} messages={chatMessages} setMessages={setChatMessages} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

