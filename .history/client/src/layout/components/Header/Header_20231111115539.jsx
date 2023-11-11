import classNames from "classnames";
import { motion } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowDownIcon } from "../../../assets/images/arrow-down-icon.svg";
import { ReactComponent as CloseIcon } from "../../../assets/images/close-icon.svg";
import { ReactComponent as HeartIcon } from "../../../assets/images/heart-icon.svg";
// eslint-disable-next-line
import { ReactComponent as ReviewIcon } from "../../../assets/images/review-icon.svg";
import { ReactComponent as SearchIcon } from "../../../assets/images/search.svg";
import { ReactComponent as SignOutIcon } from "../../../assets/images/sign-out.svg";

import { useDebounce, useOnClickOutside } from "../../../hooks";
import { setUser } from "../../../redux/features/userSlice";
import "./Header.scss";

const navigation = [
  {
    name: "Home",
    path: "",
  },
  {
    name: "Explore",
    path: "discover",
  },
];

function Header() {
  const [isShowSearchBar, showSearchBar] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isShowUserFeatures, showUserFeatures] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFocusInput, setFocusInput] = useState(false);

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef();
  const dispatch = useDispatch();

  const debounced = useDebounce(searchValue, 500);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isFocusInput) {
      return;
    }
    if (debounced !== "") {
      setSearchValue("");
      navigate(`/search?query=${debounced}`);
    }
  }, [debounced, isFocusInput, searchValue, navigate]);

  useOnClickOutside(searchInputRef, () => showSearchBar(false));

  return (
    <header
      className={classNames("header", {
        isScroll: isScrolled,
      })}
    >
      <Link className="header__logo" to="/">
        Relax<span> Movie</span>
      </Link>
      <nav className="header__nav">
        {navigation.map((val, index) => {
          return (
            <Link
              key={index}
              to={`/${val.path}`}
              className={classNames({
                active: location.pathname === `/${val.path}`,
              })}
            >
              {val.name}
            </Link>
          );
        })}
      </nav>
      <div className="header__right">
        <div
          className="header__search"
          onClick={() => {
            showSearchBar(true);
          }}
        >
          {isShowSearchBar && (
            <motion.div ref={searchInputRef} className="header__search-wrapper">
              <SearchIcon
                style={{
                  color: "#fff",
                  margin: "0 6px",
                  position: "relative",
                }}
              />
              <motion.input
                variants={{
                  open: {
                    width: "234px",
                  },
                  close: {
                    width: "0",
                  },
                }}
                animate={isShowSearchBar ? "open" : "closed"}
                type="text"
                placeholder="Tìm kiếm bộ phim yêu thích ...."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                onFocus={() => setFocusInput(true)}
                onBlur={() => setFocusInput(false)}
              />
              <div style={{ width: "20px" }}>
                {searchValue && (
                  <CloseIcon
                    className="header__search-clear"
                    onClick={() => setSearchValue("")}
                  />
                )}
              </div>
            </motion.div>
          )}
          {!isShowSearchBar && (
            <SearchIcon
              style={{
                color: "#fff",
                position: "relative",
                left: -20,
                top: 2,
              }}
            />
          )}
        </div>
        {user != null && (
          <div
            className="header__users"
            onMouseEnter={() => showUserFeatures(true)}
            onMouseLeave={() => showUserFeatures(false)}
          >
            <div className="header__users-area">
              <p style={{ color: "#fff" }}> {user.username}</p>
              <img
                src={require("../../../assets/images/user.png")}
                alt="user"
              />
              <span className="header__users-arrow">
                <ArrowDownIcon />
              </span>
            </div>
            {isShowUserFeatures && (
              <ul>
                <li>
                  <Link to="/favorite">
                    <HeartIcon style={{ color: "#fff" }} />
                    <span>Favorites</span>
                  </Link>
                </li>
                {/* <li>
                  <Link to="/">
                    <ReviewIcon style={{ color: "#fff" }} />
                    <span>Info</span>
                  </Link>
                </li> */}
                <li>
                  <button onClick={() => dispatch(setUser(null))}>
                    <SignOutIcon style={{ color: "#fff" }} />
                    <span>Sign out</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
        {user == null && (
          <button className="header__btn-signin">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="30"
              width="30"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => navigate("signin", { state: location.pathname })}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              ></path>
            </svg>
            <span>Sign in</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default memo(Header);
