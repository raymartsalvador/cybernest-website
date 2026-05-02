import type { CSSProperties } from "react";
import NavBar from "./Navbar";
import Footer from "./Footer";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  as?: keyof JSX.IntrinsicElements;
  ariaLabel?: string;
}

const roundedMap: Record<NonNullable<SkeletonProps["rounded"]>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

export function Skeleton({
  className = "",
  style,
  rounded = "md",
  as: Tag = "div",
  ariaLabel,
}: SkeletonProps) {
  const Component = Tag as React.ElementType;
  return (
    <Component
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? "status" : undefined}
      className={`skeleton-shimmer ${roundedMap[rounded]} ${className}`}
      style={style}
    />
  );
}

export function HomeSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading homepage"
      aria-live="polite"
      className="font-montserrat"
    >
      <NavBar />

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-0 px-4 sm:px-6">
        <div className="text-center max-w-5xl mx-auto">
          <Skeleton
            className="h-8 sm:h-12 w-[280px] sm:w-[460px] mx-auto mt-4 sm:mt-6 mb-3"
            rounded="full"
          />
          <div className="flex flex-col items-center gap-4 mb-6">
            <Skeleton className="h-10 sm:h-14 lg:h-16 w-[85%] max-w-[720px]" rounded="lg" />
            <Skeleton className="h-10 sm:h-14 lg:h-16 w-[70%] max-w-[600px]" rounded="lg" />
          </div>
          <div className="flex flex-col items-center gap-3 mb-6">
            <Skeleton className="h-4 sm:h-5 w-[80%] max-w-[620px]" />
            <Skeleton className="h-4 sm:h-5 w-[65%] max-w-[520px]" />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5">
            <Skeleton className="h-12 sm:h-14 w-full sm:w-48" rounded="full" />
            <Skeleton className="h-12 sm:h-14 w-full sm:w-56" rounded="full" />
          </div>
        </div>

        {/* Hero image */}
        <div className="relative mx-auto max-w-7xl mt-10">
          <Skeleton
            className="mx-auto w-full max-w-[500px] sm:max-w-[700px] md:max-w-[900px] lg:max-w-[1200px] aspect-[16/9]"
            rounded="2xl"
          />
        </div>

        {/* Stats banner */}
        <div className="relative max-w-7xl mx-auto mt-8 px-4 sm:px-6">
          <div className="bg-[#f5dde1] rounded-[40px] py-8 sm:py-10 md:py-12 px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <Skeleton className="h-12 sm:h-16 w-20 sm:w-24 bg-white/70" />
                <Skeleton className="h-5 w-40 bg-white/70" />
                <Skeleton className="h-3 w-48 bg-white/70" />
                <Skeleton className="h-3 w-36 bg-white/70" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners strip */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-5 w-56 mx-auto mb-8" />
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 sm:h-12 w-24 sm:w-32" rounded="md" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured product */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 sm:h-12 w-64 sm:w-80 mx-auto mb-4" />
          <div className="flex flex-col items-center gap-3 mb-12 sm:mb-16">
            <Skeleton className="h-4 sm:h-5 w-[80%] max-w-[900px]" />
            <Skeleton className="h-4 sm:h-5 w-[60%] max-w-[720px]" />
          </div>
          <Skeleton
            className="w-full max-w-[1255px] mx-auto aspect-[4/3] sm:aspect-[1255/477] mb-8"
            rounded="2xl"
          />
          <div className="flex items-center justify-center gap-3 mb-8">
            <Skeleton className="h-3 w-3" rounded="full" />
            <Skeleton className="h-3 w-[60px]" rounded="full" />
            <Skeleton className="h-3 w-3" rounded="full" />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Skeleton className="h-12 sm:h-14 w-full sm:w-[300px]" rounded="full" />
            <Skeleton className="h-12 sm:h-14 w-full sm:w-[260px]" rounded="full" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export function ProductsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading products"
      aria-live="polite"
      className="font-montserrat"
    >
      <NavBar />

      <main className="bg-white pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 sm:h-12 w-60 sm:w-80 mb-4" />
          <div className="flex flex-col gap-3 mb-10 sm:mb-14">
            <Skeleton className="h-4 sm:h-5 w-[85%]" />
            <Skeleton className="h-4 sm:h-5 w-[70%]" />
          </div>

          {/* Product rows */}
          <div className="flex flex-col gap-16 sm:gap-20 lg:gap-[90px]">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center"
              >
                <Skeleton className="w-full aspect-[4/3] sm:aspect-[587/474]" rounded="2xl" />
                <div className="flex flex-col gap-5">
                  <Skeleton className="h-8 sm:h-10 w-48" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[80%]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-10 sm:h-12" rounded="full" />
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <Skeleton className="h-11 sm:h-[60px] w-full sm:w-[300px]" rounded="full" />
                    <Skeleton className="h-11 sm:h-[60px] w-full sm:w-[260px]" rounded="full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Services */}
          <section className="mt-16 sm:mt-24 lg:mt-32">
            <Skeleton className="h-8 sm:h-12 w-72 mb-4" />
            <div className="flex flex-col gap-3 mb-10 sm:mb-14">
              <Skeleton className="h-4 sm:h-5 w-[85%]" />
              <Skeleton className="h-4 sm:h-5 w-[65%]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-11">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-[24px] p-4 sm:p-6 flex flex-col items-center w-full max-w-[390px] mx-auto"
                >
                  <Skeleton className="w-full aspect-[337/262]" rounded="lg" />
                  <Skeleton className="h-6 sm:h-8 w-40 mt-6" />
                  <div className="flex flex-col items-center gap-2 mt-3 w-full">
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[75%]" />
                  </div>
                  <Skeleton className="h-11 sm:h-[60px] w-full max-w-[300px] mt-6" rounded="full" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading project case study"
      aria-live="polite"
      className="font-montserrat"
    >
      <NavBar />

      <main className="bg-white pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <Skeleton className="h-4 sm:h-5 w-72 mb-6 sm:mb-8" />

          {/* Hero */}
          <Skeleton className="h-7 w-32 mb-4" rounded="full" />
          <Skeleton className="h-10 sm:h-14 lg:h-16 w-[70%] max-w-[640px] mb-4" />
          <div className="flex flex-col gap-3 mb-8">
            <Skeleton className="h-4 sm:h-5 w-[85%]" />
            <Skeleton className="h-4 sm:h-5 w-[60%]" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16">
            <Skeleton className="h-11 sm:h-[60px] w-full sm:w-[260px]" rounded="full" />
            <Skeleton className="h-11 sm:h-[60px] w-full sm:w-[280px]" rounded="full" />
          </div>

          {/* Hero image */}
          <Skeleton className="w-full aspect-[16/10] sm:aspect-[1255/620] mb-12 sm:mb-16" rounded="2xl" />

          {/* Problem */}
          <Skeleton className="h-7 w-48 mb-4" />
          <div className="flex flex-col gap-3 mb-12 sm:mb-16">
            <Skeleton className="h-4 sm:h-5 w-full" />
            <Skeleton className="h-4 sm:h-5 w-[95%]" />
            <Skeleton className="h-4 sm:h-5 w-[80%]" />
          </div>

          {/* Features */}
          <Skeleton className="h-7 w-56 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-2xl p-5 flex flex-col gap-3"
              >
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[85%]" />
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <Skeleton className="h-7 w-40 mb-4" />
          <div className="flex flex-wrap gap-2 mb-12 sm:mb-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" rounded="full" />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading about page"
      aria-live="polite"
      className="font-montserrat"
    >
      <NavBar />

      <main className="bg-white pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* About Us */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
            <Skeleton className="w-full aspect-[4/3]" rounded="2xl" />
            <div className="flex flex-col gap-5">
              <Skeleton className="h-8 sm:h-10 w-56" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[85%]" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[70%]" />
              </div>
            </div>
          </section>

          {/* Key Milestones */}
          <section className="mb-20">
            <Skeleton className="h-8 sm:h-12 w-72 mx-auto mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-100"
                >
                  <Skeleton className="h-12 w-12" rounded="full" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </section>

          {/* Certified Excellence */}
          <section>
            <Skeleton className="h-8 sm:h-12 w-80 mx-auto mb-4" />
            <div className="flex flex-col items-center gap-3 mb-10">
              <Skeleton className="h-4 sm:h-5 w-[80%]" />
              <Skeleton className="h-4 sm:h-5 w-[60%]" />
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 sm:h-20 w-24 sm:w-32" rounded="md" />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
