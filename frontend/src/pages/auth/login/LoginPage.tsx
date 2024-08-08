import { MdPassword } from "react-icons/md";
import XSvg from "../../../components/X";
import { Link } from "react-router-dom";
import { z } from "zod";
import LoginSchema from "./Schema/LoginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaUser } from "react-icons/fa";
const LoginPage = () => {
  type Login = z.infer<typeof LoginSchema>;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    mode: "onChange",
    resolver: zodResolver(LoginSchema),
  });

  const onLogin = (data: Login) => {
    console.log(data);
    reset();
  };

  return (
    <main className="container max-w-[900px]  m-auto md:flex items-center justify-between gap-36  min-h-screen py-5">
      <section className=" mb-4 flex justify-center items-center">
        <XSvg className="fill-white w-32  md:w-60 lg:md:w-72" />
      </section>
      <section className=" w-full">
        <h1 className="text-4xl mb-4 font-bold tracking-wide">Let's Go.</h1>
        <form onSubmit={handleSubmit(onLogin)} className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2">
            <FaUser />
            <input
              {...register("username")}
              type="text"
              className="grow"
              placeholder="Username"
            />
          </label>
          {errors.username && (
            <p className="text-red-500 tracking-wider text-sm font-semibold">
              {errors.username.message}
            </p>
          )}
          <label className="input input-bordered flex items-center gap-2">
            <MdPassword />
            <input
              {...register("password")}
              type="password"
              className="grow"
              placeholder="Password"
            />
          </label>
          {errors.password && (
            <p className="text-red-500 tracking-wider text-sm font-semibold">
              {errors.password.message}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary text-white text-base"
          >
            Log In
          </button>
        </form>
        <div className="mt-5 flex flex-col gap-4">
          <p className="text-center">Don't have an account?</p>
          <Link
            className="btn btn-outline border-primary w-full hover:bg-primary hover:border-primary text-base text-white hover:text-white"
            to={"/signup"}
          >
            Sign Up
          </Link>
        </div>
      </section>
    </main>
  );
};
export default LoginPage;
