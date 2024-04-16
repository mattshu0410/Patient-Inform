import DashboardSkeleton from '@/app/ui/skeletons';

// loading.tsx is placed in the routing group (overview) to make sure it only applys to page.tsx in the (overview) folder
export default function Loading() {
  return <DashboardSkeleton />;
}
