import Login from "./components/Login";
import Home from "./components/Home";
import {
  createBrowserRouter,
  createMemoryRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

const CustomLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

const App = () => {
  const router = createMemoryRouter([
    {
      path: "/",
      element: <CustomLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "home",
          element: <Home />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
