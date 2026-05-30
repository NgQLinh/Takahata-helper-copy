import { Fragment } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { DefaultLayout } from "./layouts";
import { publicRoutes } from "./routes";

type RouteType = {
  path: string;
  component: React.ComponentType<any>;
  layout?: React.ComponentType<any> | null;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route: RouteType, index: number) => {
          const Page = route.component;

          let Layout: React.ComponentType<any> = DefaultLayout;

          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
