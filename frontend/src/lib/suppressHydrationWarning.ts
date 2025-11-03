// Suppress hydration warnings in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: Extra attributes from the server')
    ) {
      return;
    }
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: Prop `className` did not match')
    ) {
      return;
    }
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Hydration failed because the initial UI does not match')
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}