import React, { useState } from "react";
import Input from "../Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup
    .string()
    .min(4, "Minimum 4 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password"),
});

export default function ChangePassword() {
  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data); // UI only
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center text-[#0A3D62] mb-2">
          Change Password
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Update your account password
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Old Password */}
          <div className="relative">
            <Input
              label="Old Password"
              type={show.old ? "text" : "password"}
              placeholder="Enter old password"
              {...register("oldPassword")}
              error={errors.oldPassword?.message}
            />
            <span
              onClick={() =>
                setShow({ ...show, old: !show.old })
              }
              className="absolute right-3 top-9 cursor-pointer text-gray-600"
            >
              {show.old ? "🙈" : "👁"}
            </span>
          </div>

          {/* New Password */}
          <div className="relative">
            <Input
              label="New Password"
              type={show.new ? "text" : "password"}
              placeholder="Enter new password"
              {...register("newPassword")}
              error={errors.newPassword?.message}
            />
            <span
              onClick={() =>
                setShow({ ...show, new: !show.new })
              }
              className="absolute right-3 top-9 cursor-pointer text-gray-600"
            >
              {show.new ? "🙈" : "👁"}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              label="Confirm Password"
              type={show.confirm ? "text" : "password"}
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
            <span
              onClick={() =>
                setShow({ ...show, confirm: !show.confirm })
              }
              className="absolute right-3 top-9 cursor-pointer text-gray-600"
            >
              {show.confirm ? "🙈" : "👁"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full mt-3 bg-[#0A3D62] text-white py-2 rounded-lg hover:bg-[#07406a] transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}