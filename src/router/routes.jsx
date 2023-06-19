import { createBrowserRouter } from "react-router-dom";
import StoloviView from "../pages/StoloviView";
import AstalView from "../pages/SingleAstalView";
import RobaView from "../pages/RobaView";
import ErrorView from "../pages/ErrorPage";
import IzvestajiView from "../pages/IzvestajiView";
import NapraviArtikalView from "../pages/NapraviArtikalView";
import App from "../App";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorView />,
    children: [
      {
        path: "/:id",
        element: <StoloviView />,
      },
      {
        path: "/stolovi/:id",
        element: <AstalView />,
      },
      {
        path: "/roba",
        element: <RobaView />,
      },
      {
        path: "/napravi-artikal",
        element: <NapraviArtikalView />,
      },
      {
        path: "/izmena-artikla/:id",
        element: <NapraviArtikalView />,
      },
      {
        path: "/izvestaji",
        element: <IzvestajiView />,
        children: [
          {
            path: "/izvestaji/:id",
            element: <IzvestajiView />,
          },
        ],
      },
    ],
  },
]);

export default routes;
