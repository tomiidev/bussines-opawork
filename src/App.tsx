import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import { API_LOCAL, API_URL } from './hooks/apis';
import AuthLayout from './layout/auth';
import DefaultLayout from './layout/DefaultLayout';
import CardList from './pages/Dashboard/ECommerce';
import JobDetail from './pages/job_id';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CreateAdvise from './pages/create_advise';
import Tables from './pages/Tables';
import ListaPacientes from './components/Tables/TableThree';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Para verificar si el usuario está autenticado
  const { pathname } = useLocation();
  const navigate = useNavigate(); // Usamos el hook para redirigir

  // Lógica de autenticación
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulamos un delay de carga de 1 segundo
  }, []);

  const checkedAuth = useRef(false);


  useEffect(() => {
    if (checkedAuth.current) return; // Evita múltiples llamadas
    checkedAuth.current = true;

    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_LOCAL}/check-auth`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: "cors",
          credentials: 'include',
        });

        const data = await response.json(); // Verifica la respuesta correctamente

        if (response.ok && data.authenticated && data.freePlan === true) { // Validar que el usuario esté autenticado
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);

          // Excluir rutas públicas de la redirección
          const isPublicRoute = pathname.startsWith('/p') || pathname.startsWith('/auth');
          if (!isPublicRoute) {
            navigate('/auth/signin', { replace: true });
          }
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [navigate, pathname]);

  // Lógica de renderizado condicional
  if (loading) {
    return <Loader />; // Muestra un Loader mientras carga la página
  }

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Muestra un estado de carga mientras verificamos la autenticación
  }

  return (
    <>
      {/* Rutas de autenticación, que usan el AuthLayout */}
      {!isAuthenticated ? (
        <Routes>

          <Route element={<AuthLayout />}>
            <Route
              path="/auth/signin"
              element={
                <>
                  <PageTitle title="Iniciar sesión | Contygo" />
                  <SignIn />
                </>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <>
                  <PageTitle title="Registrarse | Contygo" />
                  <SignUp />
                </>
              }
            />
            {/*      <Route
              path="/p"
              element={
                <>
                  <PageTitle title="Psychologist Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <PsychologistProfile />
                </>
              }
            /> */}
          </Route>
        </Routes>
      ) : (
        // Rutas protegidas, que usan el DefaultLayout
        <DefaultLayout>
          <Routes>


            <Route
              index
              element={
                <>
                  <PageTitle title="Avisos | MiChamba" />
                  <CardList />
                </>
              }
            />
            <Route
              index
              path='/avisos/:id'
              element={
                <>
                  <PageTitle title="Detalle | MiChamba" />
                  <JobDetail />
                </>
              }
            />
            <Route
              path="/perfil"
              element={
                <>
                  <PageTitle title="Perfil | MiChamba" />
                  <Settings />
                </>
              }
            />
            <Route
              path="/crearaviso"
              element={
                <>
                  <PageTitle title="Crear aviso | MiChamba" />
                  <CreateAdvise />
                </>
              }
            />
            <Route path="/postulaciones" element={<>
              <PageTitle title="Contygo | Pacientes" />
              <ListaPacientes />
            </>} />
            {/*
            <Route
              path="/calendar"
              element={
                <>
                  <PageTitle title="Contygo | Consultas" />
                  <Calendar />
                </>
              }
            />
            <Route
              path="/resources"
              element={
                <>
                  <PageTitle title="Contygo | Recursos" />
                  <Resources />
                </>
              }
            />
            <Route
              path="/billing"
              element={
                <>
                  <PageTitle title="Contygo | Pagos" />
                  <Billing />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Profile />
                </>
              }
            />
            <Route
              path="/forms/form-elements"
              element={
                <>
                  <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <FormElements />
                </>
              }
            /> */}
            {/*    <Route
              path="/forms/form-layout"
              element={
                <>
                  <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <FormLayout />
                </>
              }
            /> */}
            {/*   <Route path="/waitlist" element={<>
              <PageTitle title="Contygo | Lista de espera" />
              <ListaEspera />
            </>} />
            <Route path="/patients" element={<>
              <PageTitle title="Contygo | Pacientes" />
              <Tables />
            </>} />
            <Route path="/patients/:patientId" element={<>
              <PageTitle title="Contygo | Detalle del paciente" />
              <VistaPaciente />
            </>} />
            <Route path="/patients/:patientId/:sessionId" element={<>
              <PageTitle title="Contygo | Detalle de la sesión" />
              <VistaSesion />
            </>} />
            <Route
              path="/settings"
              element={
                <>
                  <PageTitle title="Contygo | Configuración" />
                  <Settings />
                </>
              }
            />
            <Route
              path="/chart"
              element={
                <>
                  <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Chart />
                </>
              }
            />
            <Route
              path="/ui/alerts"
              element={
                <>
                  <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Alerts />
                </>
              }
            />
            <Route
              path="/ui/buttons"
              element={
                <>
                  <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Buttons />
                </>
              }
            /> */}
          </Routes>
        </DefaultLayout>
      )}

    </>
  );
}

export default App;
