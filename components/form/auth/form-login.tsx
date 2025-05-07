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
import { useState } from "react";

interface iFormLogin {
  email: string;
  password: string;
}

const FormLogin = ({ onToggleForm }: { onToggleForm?: () => void }) => {
  const [formValues, setFormValues] = useState<iFormLogin>({
    email: "",
    password: "",
  });

  return (
    <Card className="w-[350px]">
      <CardHeader className="text-center">
        <CardTitle className="auth-title">Welcome Back</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <FormFieldInput
              name="email"
              label="Email"
              value={(formValues as iFormLogin).email}
              setFormValues={setFormValues}
              placeholder="johndoe@me.com"
              type="email"
            />
            <FormFieldInput
              name="password"
              label="Password"
              value={(formValues as iFormLogin).password}
              setFormValues={setFormValues}
              placeholder="********"
              type="password"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="auth-footer">
        <Button className="w-full">Login</Button>
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
