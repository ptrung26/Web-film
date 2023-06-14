import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import "./Layout.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListFavorites, setUser } from "../redux/features/userSlice";
import userApi from "../../src/api/modules/userApi";
import favoriteApi from "../../src/api/modules/favoriteAPI";
function Layout() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const authUser = async () => {
      const { response, err } = await userApi.getInfo();

      if (response) {
        if (response.username) dispatch(setUser(response));
        else {
          dispatch(setUser(null));
        }
      }
      if (err) dispatch(setUser(null));
    };

    authUser();
  }, [dispatch]);

  useEffect(() => {
    const getFavorites = async () => {
      const { response, err } = await favoriteApi.getList();
      if (response) dispatch(setListFavorites(response));
      if (err) {
        console.log(err);
      }
    };

    if (user) getFavorites();
    if (!user) dispatch(setListFavorites([]));
  }, [user, dispatch]);
  return (
    <div className="main-layout">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
