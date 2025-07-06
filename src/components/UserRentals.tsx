import React from 'react';
import { Calendar, BookOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function UserRentals() {
  const { rentals, books, updateRental } = useData();
  const { user } = useAuth();

  const userRentals = rentals.filter(rental => rental.userId === user?.id);
  const activeRentals = userRentals.filter(r => r.status === 'active');
  const completedRentals = userRentals.filter(r => r.status === 'returned');

  const getStatusColor = (rental: any) => {
    if (rental.status === 'returned') return 'bg-blue-100 text-blue-800';

    const today = new Date();
    const dueDate = new Date(rental.dueDate);
    if (today > dueDate) return 'bg-red-100 text-red-800';

    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (rental: any) => {
    if (rental.status === 'returned') return 'Devuelto';

    const today = new Date();
    const dueDate = new Date(rental.dueDate);
    if (today > dueDate) return 'Vencido';

    return 'Activo';
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleReturnBook = (rentalId: string) => {
    updateRental(rentalId, {
      status: 'returned',
      returnDate: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Rentas</h1>
        <p className="text-gray-600">Gestiona tus libros rentados</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rentas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{activeRentals.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Libros Devueltos</p>
              <p className="text-2xl font-bold text-gray-900">{completedRentals.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rentas</p>
              <p className="text-2xl font-bold text-gray-900">{userRentals.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Rentals */}
      {activeRentals.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Rentas Activas</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {activeRentals.map((rental) => {
              const book = books.find(b => b.id === rental.bookId);
              const daysRemaining = getDaysRemaining(rental.dueDate);

              return (
                <div key={rental.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {book?.title || 'Libro eliminado'}
                      </h4>
                      <p className="text-gray-600 mt-1">{book?.author}</p>

                      <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Rentado: {new Date(rental.rentalDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Vence: {new Date(rental.dueDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="mt-2">
                        {daysRemaining > 0 ? (
                          <span className="text-sm text-green-600 font-medium">
                            {daysRemaining} días restantes
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 font-medium">
                            Vencido hace {Math.abs(daysRemaining)} días
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rental)}`}>
                        {getStatusText(rental)}
                      </span>

                      <button
                        onClick={() => handleReturnBook(rental.id)}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Devolver
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rental History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Historial de Rentas</h2>
        </div>

        {userRentals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No tienes rentas registradas</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {userRentals
              .sort((a, b) => new Date(b.rentalDate).getTime() - new Date(a.rentalDate).getTime())
              .map((rental) => {
                const book = books.find(b => b.id === rental.bookId);
                return (
                  <div key={rental.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">
                          {book?.title || 'Libro eliminado'}
                        </h4>
                        <p className="text-gray-600 mt-1">{book?.author}</p>

                        <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(rental.rentalDate).toLocaleDateString()}
                          </div>
                          {rental.returnDate && (
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Devuelto: {new Date(rental.returnDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {rental.notes && (
                          <p className="text-sm text-gray-500 mt-2">{rental.notes}</p>
                        )}
                      </div>

                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rental)}`}>
                        {getStatusText(rental)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}