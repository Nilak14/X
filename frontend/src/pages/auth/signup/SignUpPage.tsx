import { Link } from "react-router-dom";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import XSvg from "../../../components/X";

const SignUpPage = () => {
  return (
    <main className="container max-w-[900px]  m-auto md:flex items-center justify-between gap-36  h-screen">
      <section className=" mb-4 flex justify-center items-center">
        <XSvg className="fill-white w-32  md:w-60 lg:md:w-72" />
      </section>
      <section className=" w-full">
        <h1 className="text-4xl mb-4 font-bold tracking-wide">Join Today</h1>
        <form className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2 ">
            <MdOutlineMail />
            <input type="text" className="grow " placeholder="Email" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <FaUser />
            <input type="text" className="grow" placeholder="Username" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <MdDriveFileRenameOutline />
            <input type="text" className="grow" placeholder="Full Name" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <MdPassword />
            <input type="password" className="grow" placeholder="Password" />
          </label>
          <button className="btn btn-primary text-white text-base">
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
