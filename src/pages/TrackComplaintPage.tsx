import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { getComplaintByTrackingId } from '@/db/api';
import type { ComplaintWithDetails } from '@/types';
import { Search, Loader2, MapPin, Calendar, Building2, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function TrackComplaintPage() {
  const location = useLocation();
  const [trackingId, setTrackingId] = useState(location.state?.trackingId || '');
  const [complaint, setComplaint] = useState<ComplaintWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (location.state?.trackingId) {
      handleSearch();
    }
  }, []);

  async function handleSearch() {
    if (!trackingId.trim()) {
      toast.error('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await getComplaintByTrackingId(trackingId.trim());
      setComplaint(data);
      if (!data) {
        toast.error('No complaint found with this tracking ID');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search complaint');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Track Your Complaint</h1>
            <p className="text-muted-foreground text-lg">
              Enter your tracking ID to check the status and progress of your complaint
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="tracking-id" className="sr-only">Tracking ID</Label>
                  <Input
                    id="tracking-id"
                    placeholder="Enter your tracking ID (e.g., CMA202603060001)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {complaint && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{complaint.title}</CardTitle>
                      <CardDescription>Tracking ID: {complaint.tracking_id}</CardDescription>
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

              {complaint.fraud_probability !== null && complaint.fraud_probability >= 0.7 && (
                <Card className="border-warning bg-warning/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <div className="font-medium">Under Review</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          This complaint has been flagged for verification and is currently under review by our audit team.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {searched && !complaint && !loading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Complaint Found</h3>
                <p className="text-muted-foreground">
                  Please check your tracking ID and try again
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
