'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AnalyticsData {
  totalViews: number
  totalSubscribers: number
  totalNewsletters: number
  averageReadTime: number
  topPerformingPost: {
    title: string
    views: number
  }
  recentGrowth: {
    views: number
    subscribers: number
  }
}

interface AnalyticsDashboardProps {
  data: AnalyticsData
  className?: string
}

export function AnalyticsDashboard({ data, className }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  const metrics = [
    {
      title: 'Total Views',
      value: data.totalViews.toLocaleString(),
      description: 'Lifetime article views',
      icon: '👁️',
      trend: '+12% this month'
    },
    {
      title: 'Subscribers',
      value: data.totalSubscribers.toLocaleString(),
      description: 'People following your work',
      icon: '👥',
      trend: '+5 this week'
    },
    {
      title: 'Articles Published',
      value: data.totalNewsletters.toString(),
      description: 'Total newsletters created',
      icon: '📝',
      trend: '2 this month'
    },
    {
      title: 'Avg. Read Time',
      value: `${data.averageReadTime} min`,
      description: 'Average time spent reading',
      icon: '⏱️',
      trend: '+1.2 min vs last month'
    }
  ]

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-deepBlue">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your impact and audience engagement</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? 'btn-primary' : 'btn-outline'}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-3xl font-bold text-deepBlue">{metric.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                  <p className="text-xs text-green-600 mt-1">{metric.trend}</p>
                </div>
                <div className="text-3xl">{metric.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performing Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Article</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-deepBlue">{data.topPerformingPost.title}</h4>
                <p className="text-2xl font-bold text-mintGreen">{data.topPerformingPost.views.toLocaleString()} views</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>This article has been your most successful piece, driving significant engagement and readership.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Views Growth</span>
                <span className="text-green-600 font-semibold">+{data.recentGrowth.views}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subscriber Growth</span>
                <span className="text-green-600 font-semibold">+{data.recentGrowth.subscribers}%</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Your audience is growing steadily! Keep publishing quality content to maintain this momentum.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-deepBlue">45%</div>
              <div className="text-sm text-gray-600">Direct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-deepBlue">30%</div>
              <div className="text-sm text-gray-600">Social Media</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-deepBlue">15%</div>
              <div className="text-sm text-gray-600">Search</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-deepBlue">10%</div>
              <div className="text-sm text-gray-600">Referrals</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 