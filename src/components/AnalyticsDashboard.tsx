import React, { useState, useMemo } from 'react';
import {
  BarChart3, TrendingUp, Users, Eye, MousePointer, 
  Download, Share2, RefreshCw,
  ArrowUpRight, ArrowDownRight, Target, Globe
} from 'lucide-react';
import { LinktreeData } from '../lib/irys-minimal';

interface AnalyticsDashboardProps {
  data: LinktreeData;
  dateRange?: string;
  onDateRangeChange?: React.Dispatch<React.SetStateAction<string>>;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  data, 
  dateRange: externalDateRange,
  onDateRangeChange 
}) => {
  const [internalDateRange, setInternalDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('7d');
  
  // Use external dateRange if provided, otherwise use internal state
  const dateRange = externalDateRange || internalDateRange;
  const setDateRange = onDateRangeChange || setInternalDateRange;

  // Mock analytics data
  const totalViews = 12847;
  const totalClicks = 3421;
  const uniqueVisitors = 8934;
  const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100) : 0;

  const topLinks = useMemo(() => data.links
    .filter(link => link.active)
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 5), [data.links]);

  const exportData = () => {
    const analyticsData = {
      totalViews,
      totalClicks,
      uniqueVisitors,
      clickRate,
      topLinks: topLinks.map(link => ({
        title: link.title,
        clicks: link.clicks,
        url: link.url
      }))
    };
    
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${dateRange}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Track your Linktree performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button 
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">+12.5%</span>
                <span className="text-gray-500 text-sm ml-1">vs last period</span>
              </div>
            </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <MousePointer className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+8.3%</span>
            <span className="text-gray-500 text-sm ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueVisitors.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+15.7%</span>
            <span className="text-gray-500 text-sm ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">{clickRate.toFixed(1)}%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-red-500 text-sm font-medium">-2.1%</span>
            <span className="text-gray-500 text-sm ml-1">vs last period</span>
          </div>
        </div>
          </div>

        {/* Top Performing Links */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Links</h3>
        <div className="space-y-4">
            {topLinks.map((link, index) => (
            <div key={link.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{link.title}</p>
                  <p className="text-sm text-gray-500">{link.url}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{link.clicks || 0}</p>
                <p className="text-xs text-gray-500">clicks</p>
              </div>
            </div>
          ))}
        </div>
          </div>
    </div>
  );
};