import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getCategoryDistribution, getPriorityBreakdown } from '@/db/api';
import type { CategoryDistribution, PriorityBreakdown } from '@/types';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsDashboardPage() {
  const [categoryData, setCategoryData] = useState<CategoryDistribution[]>([]);
  const [priorityData, setPriorityData] = useState<PriorityBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const [categories, priorities] = await Promise.all([
        getCategoryDistribution(),
        getPriorityBreakdown()
      ]);
      setCategoryData(categories);
      setPriorityData(priorities);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Analysis Dashboard</h1>
          <p className="text-muted-foreground">
            Visualize complaint patterns and trends
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48 bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-80 w-full bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Complaints by Category</CardTitle>
                  <CardDescription>Distribution of complaints across different categories</CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="category" 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px'
                          }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Priority Breakdown</CardTitle>
                  <CardDescription>Distribution of complaints by priority level</CardDescription>
                </CardHeader>
                <CardContent>
                  {priorityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={priorityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ priority, count }) => `${priority}: ${count}`}
                          outerRadius={100}
                          fill="hsl(var(--primary))"
                          dataKey="count"
                        >
                          {priorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>AI Insights Summary</CardTitle>
                <CardDescription>Key findings from AI analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {categoryData.reduce((sum, item) => sum + item.count, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Complaints Analyzed</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-destructive">
                      {priorityData.find(p => p.priority === 'high')?.count || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">High Priority Issues</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-success">
                      {categoryData.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Categories</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>Detailed breakdown of complaints by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{item.count} complaints</span>
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(item.count / categoryData.reduce((sum, i) => sum + i.count, 0)) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
