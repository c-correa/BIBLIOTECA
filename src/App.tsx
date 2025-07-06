import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, User, LogOut, Menu, X } from 'lucide-react';
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import BookManagement from './components/BookManagement';
import UserManagement from './components/UserManagement';
import RentalManagement from './components/RentalManagement';
import UserProfile from './components/UserProfile';
import UserBookView from './components/UserBookView';
import UserRentals from './components/UserRentals';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import AuthFormAdmin from './components/AuthFormAdmin';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';


function AppContent() {
  const navigate = useNavigate()
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'books', label: 'Gestión de Libros', icon: BookOpen },
    { id: 'users', label: 'Gestión de Usuarios', icon: Users },
    { id: 'rentals', label: 'Agendar/Rentar', icon: Calendar },
  ] as const;

  const userMenuItems = [
    { id: 'user-books', label: 'Catálogo de Libros', icon: BookOpen },
    { id: 'user-rentals', label: 'Mis Rentas', icon: Calendar },
    { id: 'profile', label: 'Mi Perfil', icon: User },
  ] as const;

  // const menuItems = user.role === 'admin' ? adminMenuItems : userMenuItems;
  console.log(1, user);
  const handleLogout = () => {
    logout()
    navigate("/")
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      {
        user && (
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                  <h1 className="text-xl font-semibold text-gray-900">BiblioSystem</h1>
                  {user.role === 'admin' && (
                    <span className="ml-3 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors }`}>
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="hidden md:inline">Cerrar Sesión</span>
                  </button>

                  {/* Mobile menu button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Mobile Navigation */}
              {isMobileMenuOpen && (
                <div className="md:hidden pb-4">
                  <div className="flex flex-col space-y-2">
                    {adminMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                          }}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-left }`}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>
        )
      }
      {/* Main Content */}
      <main className="w-full bg-gray-50  ">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<AuthForm />} />
          <Route path="/login/admin" element={<AuthFormAdmin />} />
          <Route path="/" element={<LandingPage />} />

          {/* --- RUTAS DE ADMINISTRADOR --- */}
          {/* El prop `allowedRoles` le dice al guardián quién puede entrar */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BookManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rentals"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RentalManagement />

              </ProtectedRoute>
            }
          />

          {/* --- RUTAS DE USUARIO NORMAL --- */}
          <Route
            path="/books"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserBookView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-rentals"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserRentals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Ruta para cualquier otra URL no encontrada */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;