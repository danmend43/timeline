import { TopNav } from "@/components/top-nav"
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { Timeline } from "@/components/timeline"

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-[#f7f5f3] dark:bg-gray-900">
      <TopNav />
      <div className="mx-auto flex max-w-7xl gap-6 p-6 pt-24">
        <LeftSidebar className="hidden md:block" />
        <Timeline className="flex-1" />
        <RightSidebar className="hidden lg:block" />
      </div>
    </div>
  )
}
