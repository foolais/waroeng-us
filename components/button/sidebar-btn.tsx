import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cashierSidenavItems } from "@/lib/data";
import Link from "next/link";
import LogoutButton from "./logout-btn";
import { auth } from "@/auth";
import { notFound } from "next/navigation";

const SidebarButton = async () => {
  const session = await auth();
  if (!session) return notFound();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer" variant="outline">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-4 w-40" sideOffset={6}>
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {cashierSidenavItems.map((item) => (
            <Link
              href={`/${session.user.storeId}${item.url}`}
              key={item.title}
              prefetch={true}
            >
              <DropdownMenuItem
                key={item.title}
                className="my-1 cursor-pointer"
              >
                <item.icon />
                {item.title}
              </DropdownMenuItem>
            </Link>
          ))}
          <DropdownMenuSeparator />
          <LogoutButton isCollapsed={false} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarButton;
