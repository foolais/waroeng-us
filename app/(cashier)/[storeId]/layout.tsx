import SidebarButton from "@/components/button/sidebar-btn";
import { SidebarProvider } from "@/components/ui/sidebar";
import Title from "@/components/ui/title";
import UserAvatar from "@/components/ui/user-avatar";

const CashierLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-dvh w-screen flex-col">
        <div className="flex items-center justify-between rounded-md p-4">
          <div className="flex gap-4">
            <SidebarButton />
            <Title />
          </div>
          <UserAvatar />
        </div>
        <div className="py-2">{children}</div>
      </div>
    </SidebarProvider>
  );
};

export default CashierLayout;
