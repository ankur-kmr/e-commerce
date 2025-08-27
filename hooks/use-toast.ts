import { toast } from 'sonner';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';

export interface ToastOptions {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export interface ToastConfig {
  variant?: ToastVariant;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export const useToast = () => {
  const showToast = (config: ToastConfig) => {
    const {
      variant = 'default',
      title = '',
      description,
      action,
      duration = 4000,
    } = config;

    const toastOptions = {
      duration,
      ...(action && {
        action: {
          label: action.label,
          onClick: action.onClick,
        },
      }),
    };

    switch (variant) {
      case 'success':
        toast.success(title, {
          description,
          ...toastOptions,
        });
        break;
      case 'destructive':
        toast.error(title, {
          description,
          ...toastOptions,
        });
        break;
      case 'warning':
        toast.warning(title, {
          description,
          ...toastOptions,
        });
        break;
      default:
        toast(title, {
          description,
          ...toastOptions,
        });
        break;
    }
  };



  const success = (title: string, options?: ToastOptions) => {
    showToast({
      variant: 'success',
      title,
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    });
  };

  const error = (title: string, options?: ToastOptions) => {
    showToast({
      variant: 'destructive',
      title,
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    });
  };

  const warning = (title: string, options?: ToastOptions) => {
    showToast({
      variant: 'warning',
      title,
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    });
  };

  const info = (title: string, options?: ToastOptions) => {
    showToast({
      variant: 'default',
      title,
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    });
  };

  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    toast: showToast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };
};
