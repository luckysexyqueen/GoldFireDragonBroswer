import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import InstallPage from "../pages/install/page";
import ExtensionsPage from "../pages/extensions/page";
import ExtensionOptionsPage from "../pages/extension-options/page";
import ExtensionPopupPage from "../pages/extension-popup/page";
import ExtensionNewtabPage from "../pages/extension-newtab/page";
import ExtensionWelcomePage from "../pages/extension-welcome/page";
import SettingsPage from "../pages/settings/page";
import ChatPage from "../pages/chat/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/install",
    element: <InstallPage />,
  },
  {
    path: "/extensions",
    element: <ExtensionsPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
  {
    path: "/extension-options",
    element: <ExtensionOptionsPage />,
  },
  {
    path: "/extension-popup",
    element: <ExtensionPopupPage />,
  },
  {
    path: "/extension-newtab",
    element: <ExtensionNewtabPage />,
  },
  {
    path: "/extension-welcome",
    element: <ExtensionWelcomePage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
