import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner = ({ message, className = "" }: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {message && <p className="text-sm text-muted-foreground animate-pulse">{message}</p>}
    </div>
  );
};

export const LoadingSkeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
    </div>
  );
};
