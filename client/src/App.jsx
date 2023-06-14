import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Discover from "./pages/Discover/Discover";
import Home from "./pages/Home/Home";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import { Search } from "./pages/Search/Search";
import Signin from "./pages/Login/Signin";
import Watch from "./pages/Watch/Watch";
import Favorite from "./pages/Favorite/Favorite";
import Signup from "./pages/Signup/Signup";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="discover" element={<Discover />} />
            <Route path="movie/:id" element={<MovieDetail />} />
            <Route path="movie/watch/:id" element={<Watch />} />
            <Route path="search" element={<Search />} />
            <Route path="favorite" element={<Favorite />} />
          </Route>
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route
            path="*"
            element={
              <h1
                style={{
                  color: "#fff",
                  marginTop: 80,
                }}
              >
                Not Found
              </h1>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
