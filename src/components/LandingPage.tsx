import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">BiblioSystem</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to={"login"}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link to={"login"}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gray-50 from-blue-50 via-white to-green-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-600 p-4 rounded-full shadow-lg">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Tu Biblioteca
              <span className="text-blue-600 block">Digital Moderna</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Descubre, reserva y gestiona libros con nuestro sistema de biblioteca digital.
              Una experiencia moderna y eficiente para lectores y administradores.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={"/auth"}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            {/* Secret Admin Link */}
            <div className="mt-8">
              <Link to={"/login/admin"}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors opacity-30 hover:opacity-100"
              >
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}