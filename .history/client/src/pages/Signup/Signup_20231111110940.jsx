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
      su_username: "",
      su_password: "",
      su_confirmPassword: "",
    },
    validationSchema: Yup.object({
      su_username: Yup.string()
        .matches(/^[a-zA-Z0-9]*$/, "Chỉ được nhập chữ và số")
        .min(8, "Tài khoản phải ít nhất 3 ký tự")
        .required("Tài khoản không được bỏ trống"),
      su_password: Yup.string()
        .min(8, "Mật khẩu phải từ 6 - 20 ký tự")
        .max(20, "Mật khẩu phải từ 6 - 20 ký tự")
        .required("Mật khẩu không được bỏ trống")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
          "Mật khẩu phải chứa ít nhất một chữ cái, một số, và một ký tự đặc biệt"
        ),
      su_confirmPassword: Yup.string()
        .required("Phải nhập xác nhận mật khẩu")
        .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không trùng nhau"),
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
              id="su_password"
              name="su_password"
              type="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.su_password}
            />
            {formik.touched.su_password && formik.errors.su_password ? (
              <p className="error-message">{formik.errors.su_password}</p>
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
              value={formik.values.su_confirmPassword}
            />
            {formik.touched.su_confirmPassword &&
            formik.errors.su_confirmPassword ? (
              <p className="error-message">
                {formik.errors.su_confirmPassword}
              </p>
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
