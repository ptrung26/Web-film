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
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .matches(/^[a-zA-Z0-9]*$/, "Only letters and numbers are allowed")
        .min(6, "Username must be at least 6 characters")
        .required("Username cannot be empty"),
      password: Yup.string()
        .min(6, "Password must be between 6 and 20 characters")
        .max(20, "Password must be between 6 and 20 characters")
        .required("Password cannot be empty")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
          "Password must contain at least one letter, one digit, and one special character"
        ),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Password confirmation does not match"),
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
    document.title = "Sign up";
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
