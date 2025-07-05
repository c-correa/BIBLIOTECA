import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Asegúrate de que la ruta sea correcta

function ProtectedRoute({ children, allowedRoles }: { children: ReactNode, allowedRoles: string[] }) {
  const { user } = useAuth();

  // 1. Si el usuario no está autenticado, lo enviamos al login.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 2. Si la ruta requiere un rol específico y el usuario no lo tiene,
  //    lo enviamos a una página de "no autorizado" o a su vista principal.
  //    En este caso, lo redirigimos a la página de inicio.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // 3. Si todo está en orden, mostramos el componente solicitado.
  return children;
}

export default ProtectedRoute;