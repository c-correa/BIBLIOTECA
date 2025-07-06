import React from 'react';
import { BookOpen, Users, Calendar, TrendingUp, Book, UserCheck } from 'lucide-react';
import { useData } from '../context/DataContext';


export default function Dashboard() {
  const { books, users, rentals } = useData();

  const recentRentals = rentals
    .sort((a, b) => new Date(b.rentalDate).getTime() - new Date(a.rentalDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen general del sistema de biblioteca</p>
      </div>


      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {recentRentals.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>No hay actividad reciente</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentRentals.map((rental) => {
                const book = books.find(b => b.id === rental.bookId);
                const user = users.find(u => u.id === rental.userId);
                return (
                  <div key={rental.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${rental.status === 'active' ? 'bg-green-400' :
                          rental.status === 'returned' ? 'bg-blue-400' : 'bg-red-400'
                          }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {book?.title || 'Libro eliminado'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Rentado por {user?.name || 'Usuario eliminado'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(rental.rentalDate).toLocaleDateString()}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${rental.status === 'active' ? 'bg-green-100 text-green-800' :
                          rental.status === 'returned' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {rental.status === 'active' ? 'Activo' :
                            rental.status === 'returned' ? 'Devuelto' : 'Vencido'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}