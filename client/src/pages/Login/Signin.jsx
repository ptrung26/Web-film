import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/userApi";
import { setUser } from "../../redux/features/userSlice";
import "./Signin.scss";
export default function Signin() {
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik({
    initialValues: {
      password: "",
      username: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, "username minimum 8 characters")
        .required("username is required"),
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("password is required"),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      const { response, err } = await userApi.signin(values);

      if (response) {
        formik.resetForm();
        dispatch(setUser(response));
        if (location.state) {
          navigate(location.state, {
            state: {
              status: "signin_success",
            },
          });
        } else {
          navigate("/");
        }
      }

      if (err) setErrorMessage(err.message);
    },
  });

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    return;
  }, [errorMessage]);

  return (
    <div className="Signin">
      <div className="Signin__left">
        <h1>Sign in your account</h1>
        <form className="Signin__form" onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <br></br>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="User name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <p className="error-message">{formik.errors.username}</p>
            ) : null}
          </div>
          <div className="input-group">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="error-message">{formik.errors.password}</p>
            ) : null}
          </div>

          <button type="submit">Sign in</button>
        </form>
      </div>
      <div className="Signin__right">
        <div className="Signin__right-body">
          <h1>You are new member ?</h1>
          <p className="Signin__right-info">
            Sign up and watch all movies you want
          </p>
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
