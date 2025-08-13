import NotFound from './pages/NotFound';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import LogoutPage from './pages/Logout';
import RegisterPage from './pages/Register';
import Home from './pages/Home';

export interface RouteConfig{
  path:string;
  element:React.ReactElement,
  label:string,
  showOnNavbar:boolean,
  isProtected:boolean,
  hideOnLogin:boolean
}
export const routes:RouteConfig[] = [
  { path: '/', element: <LandingPage />, label: 'Landing',isProtected:false,showOnNavbar:true,hideOnLogin:false },
  {path:'/home',element:<Home/>,label:'Home',isProtected:true,showOnNavbar:true,hideOnLogin:false},
  { path: '/login', element: <LoginPage />, label: 'Login',isProtected:false,showOnNavbar:true, hideOnLogin:true },
  { path: '/register', element:<RegisterPage/>, label: 'Register', isProtected:false, showOnNavbar:false,hideOnLogin:true},
  {path:'/logout',element:<LogoutPage/>, label:"Logout", isProtected:true, showOnNavbar:true, hideOnLogin:false},
  {path:'*',element:<NotFound/>, label:'Not Found',isProtected:false, showOnNavbar:false, hideOnLogin:false}
];