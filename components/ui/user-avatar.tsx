import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { headers } from "next/headers";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Separator } from "./separator";
import LogoutButton from "@/components/button/logout-btn";

const UserAvatar = async () => {
  const session = await auth();

  const headersList = await headers();
  const pathname = headersList.get("x-url") || "";

  if (!session) return redirect("/auth");
  if (pathname.includes("/admin") && session.user?.role !== "admin") {
    return redirect("/dashboard");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex-center cursor-pointer gap-2" role="button">
          <Avatar>
            <AvatarImage src={session?.user?.image ?? ""} alt="Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="hidden flex-col sm:flex">
            <p className="text-sm font-semibold text-gray-900">
              {session?.user?.email}
            </p>
            <p className="text-xs font-semibold text-gray-600 capitalize md:text-sm">
              {session?.user?.role}
            </p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-max">
        <span>Profile</span>
        <Separator className="my-2" />
        <LogoutButton isCollapsed={false} />
      </PopoverContent>
    </Popover>
  );
};

export default UserAvatar;
