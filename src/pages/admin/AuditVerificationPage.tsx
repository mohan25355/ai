import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getAuditQueue, updateComplaint } from '@/db/api';
import type { ComplaintWithDetails } from '@/types';
import { AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AuditVerificationPage() {
  const [complaints, setComplaints] = useState<ComplaintWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadAuditQueue();
  }, [page]);

  async function loadAuditQueue() {
    setLoading(true);
    try {
      const { data, count } = await getAuditQueue(page, limit);
      setComplaints(data);
      setTotalCount(count);
    } catch (error) {
      console.error('Failed to load audit queue:', error);
      toast.error('Failed to load audit queue');
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    setProcessing(id);
    try {
      await updateComplaint(id, { status: 'in_progress' });
      toast.success('Complaint approved and moved to in progress');
      loadAuditQueue();
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve complaint');
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(id: string) {
    setProcessing(id);
    try {
      await updateComplaint(id, { status: 'rejected' });
      toast.success('Complaint rejected');
      loadAuditQueue();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject complaint');
    } finally {
      setProcessing(null);
    }
  }

  async function handleReview(id: string) {
    setProcessing(id);
    try {
      await updateComplaint(id, { status: 'under_review' });
      toast.success('Complaint returned for review');
      loadAuditQueue();
    } catch (error) {
      console.error('Review error:', error);
      toast.error('Failed to update complaint');
    } finally {
      setProcessing(null);
    }
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Audit Verification Queue</h1>
          <p className="text-muted-foreground">
            Review complaints flagged by AI for potential fraud or verification
          </p>
        </div>

        <Card className="border-warning bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <div className="font-medium">High Fraud Probability Detected</div>
                <p className="text-sm text-muted-foreground mt-1">
                  These complaints have been flagged by our AI system with fraud probability ≥70%. 
                  Please review carefully before approving or rejecting.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Verification ({totalCount})</CardTitle>
            <CardDescription>Complaints requiring manual review</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Fraud Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full bg-muted" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : complaints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                        <div className="font-semibold mb-2">All Clear!</div>
                        <div className="text-sm text-muted-foreground">
                          No complaints pending verification at this time
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    complaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-mono text-sm">
                          {complaint.tracking_id}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {complaint.title}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {complaint.location}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive">
                            {((complaint.fraud_probability || 0) * 100).toFixed(0)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={complaint.status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(complaint.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/admin/complaints/${complaint.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  disabled={processing === complaint.id}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Approve Complaint</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will approve the complaint and move it to "In Progress" status. 
                                    Are you sure this complaint is legitimate?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleApprove(complaint.id)}>
                                    Approve
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  disabled={processing === complaint.id}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject Complaint</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will reject the complaint and mark it as fraudulent. 
                                    Are you sure you want to reject this complaint?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleReject(complaint.id)}>
                                    Reject
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReview(complaint.id)}
                              disabled={processing === complaint.id}
                            >
                              Review
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} complaints
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
