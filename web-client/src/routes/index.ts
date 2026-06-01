// Layout
import { DefaultNavigationLayout } from "../layouts";

// Page
import {
  LoginPage,
  HomePage,
  SystemControlPage,
  EquipmentPage,
  SettingsPage,
  AlertServicePage,
  ReportPage,
} from "../pages";

// Path
import {
  LoginPath,
  HomePath,
  SystemControlPath,
  EquipmentPath,
  SettingsPath,
  AlertServicePath,
  ReportPath,
} from "../constants/routes";

const publicRoutes = [
  {
    path: LoginPath,
    component: LoginPage,
  },
  {
    path: HomePath,
    component: HomePage,
    layout: DefaultNavigationLayout,
  },
  {
    path: SystemControlPath,
    component: SystemControlPage,
    layout: DefaultNavigationLayout,
  },
  {
    path: EquipmentPath,
    component: EquipmentPage,
    layout: DefaultNavigationLayout,
  },
  {
    path: SettingsPath,
    component: SettingsPage,
    layout: DefaultNavigationLayout,
  },
  {
    path: AlertServicePath,
    component: AlertServicePage,
    layout: DefaultNavigationLayout,
  },
  {
    path: ReportPath,
    component: ReportPage,
    layout: DefaultNavigationLayout,
  },
];

const privateRoutes = [];

export { privateRoutes, publicRoutes };
