import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { DashboardElectionsPage } from "./DashboardElectionsPage";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function ElectionListContainer() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              <p>There was an error loading elections: {error.message}</p>
              <Button onClick={() => resetErrorBoundary()}>Try again</Button>
            </div>
          )}
        >
          <Suspense
            fallback={
              <div className="space-y-4 mt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            }
          >
            <DashboardElectionsPage />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
