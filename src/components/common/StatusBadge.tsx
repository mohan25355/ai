import { Badge } from '@/components/ui/badge';
import type { ComplaintStatus } from '@/types';

interface StatusBadgeProps {
  status: ComplaintStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<ComplaintStatus, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-muted text-muted-foreground' },
    under_review: { label: 'Under Review', className: 'bg-warning/20 text-warning border-warning' },
    in_progress: { label: 'In Progress', className: 'bg-info/20 text-info border-info' },
    resolved: { label: 'Resolved', className: 'bg-success/20 text-success border-success' },
    rejected: { label: 'Rejected', className: 'bg-destructive/20 text-destructive border-destructive' }
  };

  const config = variants[status] || variants.pending;

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
