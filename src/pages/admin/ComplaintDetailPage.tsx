import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { getComplaintById, updateComplaint, deleteComplaint, getDepartments } from '@/db/api';
import type { ComplaintWithDetails, Department, ComplaintStatus } from '@/types';
import { ArrowLeft, MapPin, Calendar, Building2, Clock, DollarSign, AlertCircle, Trash2, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
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

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<ComplaintWithDetails | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('pending');
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      loadComplaint();
      loadDepartments();
    }
  }, [id]);

  async function loadComplaint() {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getComplaintById(id);
      if (data) {
        setComplaint(data);
        setSelectedStatus(data.status);
        setSelectedDepartment(data.assigned_department);
      } else {
        toast.error('Complaint not found');
        navigate('/admin/complaints');
      }
    } catch (error) {
      console.error('Failed to load complaint:', error);
      toast.error('Failed to load complaint');
    } finally {
      setLoading(false);
    }
  }

  async function loadDepartments() {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to load departments:', error);
    }
  }

  async function handleUpdate() {
    if (!id || !complaint) return;
    setUpdating(true);
    try {
      await updateComplaint(id, {
        status: selectedStatus,
        assigned_department: selectedDepartment
      });
      toast.success('Complaint updated successfully');
      loadComplaint();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update complaint');
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    try {
      await deleteComplaint(id);
      toast.success('Complaint deleted successfully');
      navigate('/admin/complaints');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete complaint');
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64 bg-muted" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 bg-muted" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-3/4 bg-muted" />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (!complaint) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/admin/complaints')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Complaints
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this complaint? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{complaint.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Tracking ID: {complaint.tracking_id}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{complaint.description}</p>
            </div>

            {complaint.photo_url && (
              <div>
                <h3 className="font-semibold mb-2">Photo Evidence</h3>
                <img 
                  src={complaint.photo_url} 
                  alt="Complaint evidence" 
                  className="rounded-lg max-h-96 w-full object-cover"
                />
              </div>
            )}

            <Separator />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{complaint.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Submitted On</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(complaint.created_at), 'PPP')}
                    </div>
                  </div>
                </div>

                {complaint.category && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Category</div>
                      <div className="text-sm text-muted-foreground">{complaint.category.name}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {complaint.department && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Assigned Department</div>
                      <div className="text-sm text-muted-foreground">{complaint.department.name}</div>
                    </div>
                  </div>
                )}

                {complaint.predicted_resolution_days && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Predicted Resolution</div>
                      <div className="text-sm text-muted-foreground">
                        {complaint.predicted_resolution_days} days
                      </div>
                    </div>
                  </div>
                )}

                {complaint.estimated_cost_min && complaint.estimated_cost_max && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Estimated Cost</div>
                      <div className="text-sm text-muted-foreground">
                        ₹{complaint.estimated_cost_min.toLocaleString()} - ₹{complaint.estimated_cost_max.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {complaint.fraud_probability !== null && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Fraud Probability</div>
                      <div className="text-sm text-muted-foreground">
                        {(complaint.fraud_probability * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {complaint.ai_analyzed && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    AI Analysis
                  </h3>

                  {complaint.main_issue && (
                    <div>
                      <div className="font-medium text-sm mb-1">Main Issue</div>
                      <p className="text-sm text-muted-foreground">{complaint.main_issue}</p>
                    </div>
                  )}

                  {complaint.root_cause && (
                    <div>
                      <div className="font-medium text-sm mb-1">Root Cause</div>
                      <p className="text-sm text-muted-foreground">{complaint.root_cause}</p>
                    </div>
                  )}

                  {complaint.suggested_solution && (
                    <div>
                      <div className="font-medium text-sm mb-1">Suggested Solution</div>
                      <p className="text-sm text-muted-foreground">{complaint.suggested_solution}</p>
                    </div>
                  )}

                  {complaint.sentiment && (
                    <div>
                      <div className="font-medium text-sm mb-1">Sentiment</div>
                      <p className="text-sm text-muted-foreground capitalize">{complaint.sentiment.toLowerCase()}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Complaint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ComplaintStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Assigned Department</label>
                <Select 
                  value={selectedDepartment?.toString() || ''} 
                  onValueChange={(value) => setSelectedDepartment(value ? Number(value) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleUpdate} disabled={updating}>
              {updating ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-pulse" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
