"use client";

export function LoadingBar() {
  return (
    <div className="fixed top-0 right-0 left-0 z-50 h-0.5 bg-transparent">
      <div className="bg-primary h-full w-0 opacity-0 transition-all duration-1400 group-has-[[data-pending]]/layout:w-full group-has-[[data-pending]]/layout:animate-pulse group-has-[[data-pending]]/layout:opacity-100" />
    </div>
  );
}
