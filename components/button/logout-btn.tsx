"use client";

import { Button } from "@/components/ui/button";
import { Loader2, LogOutIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { logoutCredentials } from "@/lib/action/action-auth";
import { useTransition } from "react";

const LogoutButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutCredentials();
      router.push("/auth");
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-start">
          <LogOutIcon color="red" />
          <span className={isCollapsed ? "hidden" : ""}>Logout</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent aria-description="logout" aria-describedby="logout">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to logout?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/70"
          >
            {isPending ? "Logging out..." : "Yes"}
            {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutButton;
