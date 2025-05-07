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

interface iFormRegister {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const FormRegister = ({ onToggleForm }: { onToggleForm?: () => void }) => {
  const [formValues, setFormValues] = useState<iFormRegister>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <Card className="w-[350px]">
      <CardHeader className="text-center">
        <CardTitle className="auth-title">Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <FormFieldInput
              name="username"
              label="Username"
              value={(formValues as iFormRegister).username}
              setFormValues={setFormValues}
              placeholder="johndoe@me.com"
              type="username"
            />
            <FormFieldInput
              name="email"
              label="Email"
              value={(formValues as iFormRegister).email}
              setFormValues={setFormValues}
              placeholder="johndoe@me.com"
              type="email"
            />
            <FormFieldInput
              name="password"
              label="Password"
              value={(formValues as iFormRegister).password}
              setFormValues={setFormValues}
              placeholder="********"
              type="password"
            />
            <FormFieldInput
              name="confirmPassword"
              label="Confirm Password"
              value={(formValues as iFormRegister).confirmPassword}
              setFormValues={setFormValues}
              placeholder="********"
              type="confirmPassword"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="auth-footer">
        <Button className="w-full">Register</Button>
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
