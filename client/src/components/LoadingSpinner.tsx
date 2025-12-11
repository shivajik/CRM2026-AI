export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" data-testid="loading-spinner">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12" data-testid="page-loading-spinner">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
