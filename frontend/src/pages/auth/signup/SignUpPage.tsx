import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import XSvg from "../../../components/X";
import SignUpSchema from "./Schema/SignUpSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";

const SignUpPage = () => {
  type SignUp = z.infer<typeof SignUpSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUp>({
    mode: "onChange",
    resolver: zodResolver(SignUpSchema),
  });

  const onSignUp = (data: SignUp) => {
    console.log(data);
    reset();
  };

  return (
    <main className="container max-w-[900px]  m-auto md:flex items-center justify-between gap-36  min-h-screen py-5">
      <section className=" mb-4 flex justify-center items-center">
        <XSvg className="fill-white w-32  md:w-60 lg:md:w-72" />
      </section>
      <section className=" w-full">
        <h1 className="text-4xl mb-4 font-bold tracking-wide">Join Today</h1>
        <form onSubmit={handleSubmit(onSignUp)} className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2 ">
            <MdOutlineMail />
            <input
              {...register("email")}
              type="text"
              className="grow "
              placeholder="Email"
            />
          </label>
          {errors.email && (
            <p className="text-red-500 tracking-wider text-sm font-semibold">
              {errors.email.message}
            </p>
          )}
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
            <MdDriveFileRenameOutline />
            <input
              {...register("fullName")}
              type="text"
              className="grow"
              placeholder="Full Name"
            />
          </label>
          {errors.fullName && (
            <p className="text-red-500 tracking-wider text-sm font-semibold">
              {errors.fullName.message}
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
          <label className="input input-bordered flex items-center gap-2">
            <MdPassword />
            <input
              {...register("confirmPassword")}
              type="password"
              className="grow"
              placeholder="Confirm Password"
            />
          </label>
          {errors.confirmPassword && (
            <p className="text-red-500 tracking-wider text-sm font-semibold">
              {errors.confirmPassword.message}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary text-white text-base"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-5 flex flex-col gap-4">
          <p className="text-center">Already have an Account?</p>
          <Link
            className="btn btn-outline border-primary w-full hover:bg-primary hover:border-primary text-base text-white hover:text-white"
            to={"/login"}
          >
            Log In
          </Link>
        </div>
      </section>
    </main>
  );
};
export default SignUpPage;
