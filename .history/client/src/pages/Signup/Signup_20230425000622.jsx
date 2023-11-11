import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import userApi from "../../api/modules/userApi";
import { setUser } from "../../redux/features/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "./Signup.scss";
export default function Signup() {
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
    validationSchema: Yup.object({
      displayName: Yup.string().required("displayName is required"),
      username: Yup.string()
        .min(8, "username minimum 8 characters")
        .required("username is required"),
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("password is required"),
      confirmPassword: Yup.string()
        .required("Please retype your password.")
        .oneOf([Yup.ref("password")], "Your passwords do not match."),
    }),
    onSubmit: async (values) => {
      values.color = randomRGBColor();
      setErrorMessage(undefined);
      const { response, err } = await userApi.signup(values);

      if (response) {
        formik.resetForm();
        dispatch(setUser(response));
        if (location.state) {
          navigate(location.state);
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

  const randomRGBColor = () => {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    let color = `rgb(${r}, ${g}, ${b})`;
    return color;
  };

  return (
    <div className="Signup">
      <div className="Signup__left">
        <h1>Sign up your account</h1>
        <form className="Signup__form" onSubmit={formik.handleSubmit}>
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
              id="displayName"
              name="displayName"
              type="text"
              placeholder="Display name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.displayName}
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
          <div className="input-group">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="error-message">{formik.errors.confirmPassword}</p>
            ) : null}
          </div>
          <button type="submit">Sign up</button>
        </form>
      </div>
      <div className="Signup__right">
        <div className="Signup__right-body">
          <h1>You are member ?</h1>
          <p className="Signup__right-info">Sign in right now !</p>
          <Link to="/signin">Sign in</Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
