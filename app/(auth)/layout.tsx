import Image from "next/image";
import { ReactNode } from "react";
import FoodHero from "@/public/food-hero.jpg";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-background flex h-screen w-full p-6">
      <div className="md:flex-center relative hidden h-full overflow-hidden rounded-xl md:flex md:w-1/2 xl:w-[40%]">
        <Image
          alt="FoodHero"
          src={FoodHero}
          className="object-cover"
          priority
          quality={80}
          placeholder="blur"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6 text-center">
          <h1 className="max-w-md text-3xl leading-tight font-extrabold text-white">
            Tingkatkan Efisiensi dan Produktivitas dengan
            <span className="bg-primary ml-2 rounded-xl px-2">Waroeng Us</span>
          </h1>
        </div>
      </div>
      <div className="flex-center w-full md:w-1/2 xl:w-[60%]">{children}</div>
    </div>
  );
};

export default AuthLayout;
