import { cn } from "@/lib/utils";

import { AppSidebarNav } from "./AppSidebarNav";
import { AuthBrand } from "./AuthBrand";
import { SidebarToggle } from "./SidebarToggle";
import { useSidebarContext } from "./SidebarContext";

interface AppSidebarProps {
  userName?: string;
  showDashboard: boolean;
  dashboardFirst?: boolean;
  onLogout: () => void;
}

export function AppSidebar({
  userName,
  showDashboard,
  dashboardFirst,
  onLogout,
}: AppSidebarProps) {
  const { isOpen, close } = useSidebarContext();

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-overlay bg-black/40 md:hidden"
          onClick={close}
        />
      ) : null}

      <aside
        className={cn(
          "flex h-full shrink-0 flex-col overflow-hidden border-r z-40 border-border bg-card transition-[width,transform] duration-normal ease-default",
          "fixed inset-y-0 left-0 z-modal md:relative md:z-auto",
          isOpen ? "w-sidebar translate-x-0" : "w-14 translate-x-0",
        )}
      >
        <div
          className={cn("flex h-full flex-col", isOpen ? "w-sidebar" : "w-14")}
        >
          <div
            className={cn(
              "flex h-header justify-between shrink-0 items-center border-b border-border",
              isOpen ? "gap-stack-sm px-page" : "justify-center",
            )}
          >
            {isOpen ? <AuthBrand /> : null}
            <SidebarToggle />
          </div>

          {isOpen ? (
            <AppSidebarNav
              userName={userName}
              showDashboard={showDashboard}
              dashboardFirst={dashboardFirst}
              onLogout={onLogout}
            />
          ) : null}
        </div>
      </aside>
    </>
  );
}
