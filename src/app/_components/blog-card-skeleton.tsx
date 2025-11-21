// Skeleton loading component for blog cards
// Matches brutalist design with hard shadows and rounded corners

export function BlogCardSkeleton() {
  return (
    <div className="group relative flex flex-col overflow-hidden brutalist-border bg-[var(--card)] animate-pulse">
      {/* Image skeleton with brutalist styling */}
      <div className="relative w-full h-48 bg-[var(--muted)] border-b-3 border-[var(--foreground)]">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--muted)] via-[var(--border)] to-[var(--muted)] animate-shimmer" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col flex-1 p-6 space-y-4">
        {/* Category badge skeleton */}
        <div className="w-24 h-6 bg-[var(--muted)] rounded" />

        {/* Title skeleton - 2 lines */}
        <div className="space-y-2">
          <div className="h-6 bg-[var(--muted)] rounded w-full" />
          <div className="h-6 bg-[var(--muted)] rounded w-4/5" />
        </div>

        {/* Excerpt skeleton - 3 lines */}
        <div className="space-y-2">
          <div className="h-4 bg-[var(--muted)] rounded w-full" />
          <div className="h-4 bg-[var(--muted)] rounded w-full" />
          <div className="h-4 bg-[var(--muted)] rounded w-3/4" />
        </div>

        {/* Spacer to push footer to bottom */}
        <div className="flex-1" />

        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-[var(--border)]">
          <div className="h-4 bg-[var(--muted)] rounded w-24" />
          <div className="h-8 w-8 bg-[var(--muted)] rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BlogGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
