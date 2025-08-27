'use client';

import { Button } from '@/components/ui/button';
import { useToast } from './use-toast';

export const ToastTest = () => {
  const { toast } = useToast();

  const testObjectAPI = () => {
    // Test the new object-based API
    toast({
      variant: 'destructive',
      title: 'Test Error',
      description: 'This is a test error message',
    });
  };

  const testDescriptionOnly = () => {
    // Test with just description (no title)
    toast({
      variant: 'success',
      description: 'This is a success message with only description',
    });
  };

  const testWithAction = () => {
    // Test with action button
    toast({
      variant: 'warning',
      title: 'Warning',
      description: 'This is a warning with action',
      action: {
        label: 'Dismiss',
        onClick: () => console.log('Dismissed'),
      },
    });
  };

  const testCustomDuration = () => {
    // Test with custom duration
    toast({
      variant: 'default',
      title: 'Info',
      description: 'This toast will stay for 10 seconds',
      duration: 10000,
    });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Toast API Test</h2>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={testObjectAPI} variant="destructive">
          Test Object API
        </Button>
        
        <Button onClick={testDescriptionOnly} variant="default">
          Description Only
        </Button>
        
        <Button onClick={testWithAction} variant="outline">
          With Action
        </Button>
        
        <Button onClick={testCustomDuration} variant="secondary">
          Custom Duration
        </Button>
      </div>
    </div>
  );
};
