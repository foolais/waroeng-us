"use client";

import FormLogin from "@/components/form/auth/form-login-new";
import FormRegister from "@/components/form/auth/form-register";
import { useState } from "react";

const AuthPage = () => {
  const [isFormLogin, setIsFormLogin] = useState<boolean>(true);
  const handleToggleForm = () => setIsFormLogin((prev) => !prev);

  return (
    <div>
      {isFormLogin ? (
        <FormLogin onToggleForm={handleToggleForm} />
      ) : (
        <FormRegister onToggleForm={handleToggleForm} />
      )}
    </div>
  );
};

export default AuthPage;
