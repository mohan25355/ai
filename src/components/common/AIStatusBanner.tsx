import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Brain, CheckCircle, AlertCircle } from 'lucide-react';

interface AIStatusBannerProps {
  aiAnalyzed: boolean;
  fraudProbability?: number | null;
}

export function AIStatusBanner({ aiAnalyzed, fraudProbability }: AIStatusBannerProps) {
  if (!aiAnalyzed) {
    return (
      <Alert className="border-info bg-info/10">
        <Brain className="h-4 w-4 text-info" />
        <AlertTitle>AI Analysis Pending</AlertTitle>
        <AlertDescription>
          This complaint is being analyzed by our AI system. Results will be available shortly.
        </AlertDescription>
      </Alert>
    );
  }

  if (fraudProbability !== null && fraudProbability !== undefined && fraudProbability >= 0.7) {
    return (
      <Alert className="border-warning bg-warning/10">
        <AlertCircle className="h-4 w-4 text-warning" />
        <AlertTitle>Under Review</AlertTitle>
        <AlertDescription>
          This complaint has been flagged for verification (fraud probability: {(fraudProbability * 100).toFixed(0)}%) 
          and is currently under review by our audit team.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-success bg-success/10">
      <CheckCircle className="h-4 w-4 text-success" />
      <AlertTitle>AI Analysis Complete</AlertTitle>
      <AlertDescription>
        This complaint has been analyzed by our AI system. View the insights below.
      </AlertDescription>
    </Alert>
  );
}
