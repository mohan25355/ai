import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats } from '@/db/api';
import type { DashboardStats } from '@/types';
import { FileText, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      title: 'Total Complaints',
      value: stats?.total || 0,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Urgent Complaints',
      value: stats?.urgent || 0,
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    {
      title: 'Suspicious Complaints',
      value: stats?.suspicious || 0,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Resolved Complaints',
      value: stats?.resolved || 0,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of complaints and system performance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24 bg-muted" />
                  <Skeleton className="h-8 w-8 rounded-md bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 bg-muted" />
                </CardContent>
              </Card>
            ))
          ) : (
            statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} p-2 rounded-md`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/complaints">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Complaints
                </Button>
              </Link>
              <Link to="/admin/audit">
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Review Suspicious Complaints
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  View Analytics Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">AI Analysis Status</div>
                <div className="text-sm text-muted-foreground">
                  All complaints are automatically analyzed using AI
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Fraud Detection</div>
                <div className="text-sm text-muted-foreground">
                  Complaints with fraud probability ≥70% are sent to audit queue
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Resolution Tracking</div>
                <div className="text-sm text-muted-foreground">
                  Predicted resolution times are calculated based on priority
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="font-medium">1. Review Complaints</div>
                <p className="text-sm text-muted-foreground">
                  Check the complaints list to see all submitted issues with AI analysis
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-medium">2. Verify Suspicious Items</div>
                <p className="text-sm text-muted-foreground">
                  Review complaints in the audit queue that have been flagged for verification
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-medium">3. Analyze Trends</div>
                <p className="text-sm text-muted-foreground">
                  Use the analytics dashboard to identify patterns and prioritize resources
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
