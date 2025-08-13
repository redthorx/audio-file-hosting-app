import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter,Routes,Route } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { routes } from './routes';
import NavbarComponent from './component/NavBar';
import { AlertProvider } from './providers/AlertProvider';
import { A } from 'react-router/dist/development/routeModules-qBivMBjd';
import AlertComponent from './component/Alert';
import { SessionProvider } from './providers/SessonProvider';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SessionProvider>
      <BrowserRouter basename='/web'>
        <AlertProvider>
          <NavbarComponent/>
          <AlertComponent/>
          <Routes>
            {routes.map(({path,element,isProtected})=>(
              <Route key={path} path={path} element={element}/>
            ))}
          </Routes>
        </AlertProvider>
      </BrowserRouter>
    </SessionProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
