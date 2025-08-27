# Custom Hooks

## useToast

A custom hook that wraps the Sonner toast library to provide a consistent and type-safe API for displaying toast notifications.

### Usage

```tsx
import { useToast } from '@/hooks/use-toast';

const MyComponent = () => {
  const { success, error, warning, info, dismiss, dismissAll } = useToast();

  const handleSuccess = () => {
    success('Operation completed successfully!', {
      description: 'Your item has been added to the cart',
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart'),
      },
    });
  };

  const handleError = () => {
    error('Something went wrong!', {
      description: 'Please try again later',
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
};
```

### API

#### Methods

- `success(title: string, options?: ToastOptions)` - Shows a success toast
- `error(title: string, options?: ToastOptions)` - Shows an error toast
- `warning(title: string, options?: ToastOptions)` - Shows a warning toast
- `info(title: string, options?: ToastOptions)` - Shows an info toast
- `toast(config: ToastConfig)` - Object-based toast method
- `dismiss(toastId?: string | number)` - Dismisses a specific toast
- `dismissAll()` - Dismisses all toasts

#### Types

```tsx
type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';

interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number; // Default: 4000ms
}

interface ToastConfig {
  variant?: ToastVariant; // Default: 'default'
  title?: string; // Default: ''
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number; // Default: 4000ms
}
```

### Examples

#### Basic Usage
```tsx
const { success, error } = useToast();

// Simple success toast
success('Item added to cart');

// Error toast with description
error('Failed to add item', {
  description: 'Please check your connection and try again',
});
```

#### With Action Button
```tsx
const { success } = useToast();

success('Item added to cart', {
  description: 'Your item has been successfully added',
  action: {
    label: 'View Cart',
    onClick: () => router.push('/cart'),
  },
});
```

#### Custom Duration
```tsx
const { warning } = useToast();

warning('Session expiring soon', {
  description: 'Please save your work',
  duration: 10000, // 10 seconds
});
```

#### Using Object-Based API
```tsx
const { toast } = useToast();

toast({
  variant: 'destructive',
  title: 'Critical Error',
  description: 'System failure detected',
  duration: 8000,
});

// Or with just description (title will be empty)
toast({
  variant: 'destructive',
  description: 'System failure detected',
});
```

### Migration from Direct Sonner Usage

**Before:**
```tsx
import { toast } from 'sonner';

toast.success('Success message');
toast.error('Error message');
```

**After:**
```tsx
import { useToast } from '@/hooks/use-toast';

const { success, error } = useToast();

success('Success message');
error('Error message');
```

### Benefits

1. **Type Safety** - Full TypeScript support with proper type checking
2. **Consistent API** - Unified interface across the application
3. **Better Developer Experience** - IntelliSense support and autocomplete
4. **Easier Testing** - Can be easily mocked in tests
5. **Future-Proof** - Easy to switch toast libraries if needed
