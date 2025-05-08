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
import { useActionState, useState } from "react";
import { registerCredentials } from "@/lib/action/action-auth";

interface iFormRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const FormRegister = ({ onToggleForm }: { onToggleForm?: () => void }) => {
  const [formValues, setFormValues] = useState<iFormRegister>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [state, formAction, isPending] = useActionState(
    registerCredentials,
    null,
  );

  return (
    <Card className="w-[350px]">
      <CardHeader className="text-center">
        <CardTitle className="auth-title">Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-register" action={formAction}>
          <div className="grid w-full items-center gap-4">
            <FormFieldInput
              name="name"
              label="Name"
              value={(formValues as iFormRegister).name}
              setFormValues={setFormValues}
              placeholder="John"
              type="name"
              error={
                typeof state?.error === "object" && "name" in state.error
                  ? state.error.name
                  : []
              }
            />
            <FormFieldInput
              name="email"
              label="Email"
              value={(formValues as iFormRegister).email}
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
              name="password"
              label="Password"
              value={(formValues as iFormRegister).password}
              setFormValues={setFormValues}
              placeholder="********"
              type="password"
              error={
                typeof state?.error === "object" && "password" in state.error
                  ? state.error.password
                  : []
              }
            />
            <FormFieldInput
              name="confirmPassword"
              label="Confirm Password"
              value={(formValues as iFormRegister).confirmPassword}
              setFormValues={setFormValues}
              placeholder="********"
              type="confirmPassword"
              error={
                typeof state?.error === "object" &&
                "confirmPassword" in state.error
                  ? state.error.confirmPassword
                  : []
              }
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="auth-footer">
        <Button className="w-full" form="form-register" disabled={isPending}>
          {isPending ? "Registering..." : "Register"}
        </Button>
        <p>
          Already have an account?{" "}
          <Button
            variant="ghost"
            size="sm"
            className="px-1.5"
            onClick={onToggleForm}
          >
            Sign in
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default FormRegister;
