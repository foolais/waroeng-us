"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { LoginSchema } from "@/lib/zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginCredentials } from "@/lib/action/action-auth";
import { toast } from "sonner";

const FormLogin = ({ onToggleForm }: { onToggleForm?: () => void }) => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      try {
        const res = await loginCredentials(values);

        if (res.success) toast.success(res.message, { duration: 1500 });
        if (res.error && res.type === "credentials")
          toast.error(res.message, { duration: 1500 });
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <Card className="w-[350px]">
      <CardHeader className="text-center">
        <CardTitle className="auth-title">Welcome Back</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="form-login"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="johndoe@me.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="johndoe@me.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="auth-footer">
        <Button
          type="submit"
          className="w-full"
          form="form-login"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login"}
          {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
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
