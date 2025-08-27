'use client';

import { Button } from '@/components/ui/button';
import { useToast } from './use-toast';

export const ToastExample = () => {
  const { success, error, warning, info, dismissAll, toast } = useToast();

  const handleSuccess = () => {
    success('Success!', {
      description: 'This is a success message with description',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo clicked'),
      },
    });
  };

  const handleError = () => {
    error('Error!', {
      description: 'This is an error message with description',
    });
  };

  const handleWarning = () => {
    warning('Warning!', {
      description: 'This is a warning message with description',
    });
  };

  const handleInfo = () => {
    info('Info!', {
      description: 'This is an info message with description',
    });
  };

  const handleCustomToast = () => {
    // Using the new object-based API
    toast({
      variant: 'destructive',
      title: 'Custom Error',
      description: 'This is a custom error toast',
      duration: 6000,
    });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Toast Examples</h2>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSuccess} variant="default">
          Success Toast
        </Button>
        
        <Button onClick={handleError} variant="destructive">
          Error Toast
        </Button>
        
        <Button onClick={handleWarning} variant="outline">
          Warning Toast
        </Button>
        
        <Button onClick={handleInfo} variant="secondary">
          Info Toast
        </Button>
        
        <Button onClick={handleCustomToast} variant="outline">
          Custom Toast
        </Button>
        
        <Button onClick={dismissAll} variant="ghost">
          Dismiss All
        </Button>
      </div>
    </div>
  );
};
