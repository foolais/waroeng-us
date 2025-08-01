import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/lib/action/action-user";
import { getButtonText } from "@/lib/utils";
import { changePasswordSchema } from "@/lib/zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormChangePassword = ({ onClose }: { onClose: () => void }) => {
  const [isShow, setIsShow] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isSubmitting, startSubmitting] = useTransition();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof changePasswordSchema>) => {
    startSubmitting(async () => {
      const { oldPassword, newPassword } = values;

      const res = await changePassword(oldPassword, newPassword);
      if (res.success) {
        toast.success(res.message, { duration: 1500 });
        form.reset();
        onClose();
      } else if (res.error && "message" in res) {
        toast.error(res.message as string, { duration: 1500 });
      }
    });
  };

  const iconStyle = "absolute top-1/2 right-3 -translate-y-1/2";

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Lama</FormLabel>
              <div className="relative">
                <Input
                  placeholder="******"
                  type={isShow.oldPassword ? "text" : "password"}
                  {...field}
                />
                <span>
                  {isShow.oldPassword ? (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() =>
                        setIsShow({ ...isShow, oldPassword: false })
                      }
                      className={iconStyle}
                    >
                      <Eye />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() =>
                        setIsShow({ ...isShow, oldPassword: true })
                      }
                      className={iconStyle}
                    >
                      <EyeClosed />
                    </Button>
                  )}
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Baru</FormLabel>
              <div className="relative">
                <Input
                  placeholder="******"
                  type={isShow.newPassword ? "text" : "password"}
                  {...field}
                />
                <span>
                  {isShow.newPassword ? (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() =>
                        setIsShow({ ...isShow, newPassword: false })
                      }
                      className={iconStyle}
                    >
                      <Eye />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() =>
                        setIsShow({ ...isShow, newPassword: true })
                      }
                      className={iconStyle}
                    >
                      <EyeClosed />
                    </Button>
                  )}
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password Baru</FormLabel>
              <div className="relative">
                <Input
                  placeholder="******"
                  type={isShow.confirmPassword ? "text" : "password"}
                  {...field}
                />
                <span>
                  {isShow.confirmPassword ? (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() =>
                        setIsShow({ ...isShow, confirmPassword: false })
                      }
                      className={iconStyle}
                    >
                      <Eye />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() =>
                        setIsShow({ ...isShow, confirmPassword: true })
                      }
                      className={iconStyle}
                    >
                      <EyeClosed />
                    </Button>
                  )}
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="ml-auto flex" disabled={isSubmitting}>
          {getButtonText("UPDATE", "Password", isSubmitting)}
          {isSubmitting && <Loader2 className="ml-2 size-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};

export default FormChangePassword;
