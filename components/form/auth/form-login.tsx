"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormFieldInput } from "../form-field";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { loginCredentials } from "@/lib/action/action-auth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface iFormLogin {
  email: string;
  password: string;
}

const FormLogin = ({ onToggleForm }: { onToggleForm?: () => void }) => {
  const [formValues, setFormValues] = useState<iFormLogin>({
    email: "",
    password: "",
  });

  const [state, formAction, isPending] = useActionState(loginCredentials, null);

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (state && state.success && session?.user) {
      const { role, store_id } = session.user;
      let redirectUrl = "/";
      switch (role) {
        case "SUPER_ADMIN":
          redirectUrl = "/super/dashboard";
          break;
        case "ADMIN":
          redirectUrl = `/${store_id}/admin/dashboard`;
          break;
        case "CASHIER":
          redirectUrl = `/${store_id}/dashboard`;
          break;
      }
      router.push(redirectUrl);
    }
  }, [session?.user, state, router]);

  return (
    <Card className="w-[350px]">
      <CardHeader className="text-center">
        <CardTitle className="auth-title">Welcome Back</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-login" action={formAction}>
          <div className="grid w-full items-center gap-4">
            <FormFieldInput
              disabled={!!state?.success}
              name="email"
              label="Email"
              value={(formValues as iFormLogin).email}
              setFormValues={setFormValues}
              placeholder="johndoe@me.com"
              type="email"
              error={
                typeof state?.error === "object" && "email" in state.error
                  ? state.error.email
                  : []
              }
            />
            <FormFieldInput
              disabled={!!state?.success}
              name="password"
              label="Password"
              value={(formValues as iFormLogin).password}
              setFormValues={setFormValues}
              placeholder="********"
              type="password"
              error={
                typeof state?.error === "object" && "password" in state.error
                  ? state.error.password
                  : []
              }
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="auth-footer">
        <Button
          className="w-full"
          form="form-login"
          disabled={isPending || !!state?.success}
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>
        <p>
          Don&apos;t have an account?{" "}
          <Button
            variant="ghost"
            size="sm"
            className="px-1.5"
            onClick={onToggleForm}
          >
            Sign up
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default FormLogin;
