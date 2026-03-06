import { Badge } from '@/components/ui/badge';
import type { ComplaintPriority } from '@/types';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface PriorityBadgeProps {
  priority: ComplaintPriority | null;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  if (!priority) {
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        <Info className="h-3 w-3 mr-1" />
        Not Analyzed
      </Badge>
    );
  }

  const variants: Record<ComplaintPriority, { label: string; className: string; icon: any }> = {
    low: { 
      label: 'Low Priority', 
      className: 'bg-success/20 text-success border-success',
      icon: Info
    },
    medium: { 
      label: 'Medium Priority', 
      className: 'bg-warning/20 text-warning border-warning',
      icon: AlertTriangle
    },
    high: { 
      label: 'High Priority', 
      className: 'bg-destructive/20 text-destructive border-destructive',
      icon: AlertCircle
    }
  };

  const config = variants[priority];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
