import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, AlertCircle, User } from 'lucide-react';
import { useData, Rental } from '../context/DataContext';

export default function RentalManagement() {
  const { books, users, rentals, addRental, updateRental, deleteRental } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    bookId: '',
    userId: '',
    rentalDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
  });

  // Calculate due date (default 14 days from rental date)
  React.useEffect(() => {
    if (formData.rentalDate) {
      const rentalDate = new Date(formData.rentalDate);
      const dueDate = new Date(rentalDate);
      dueDate.setDate(dueDate.getDate() + 14);
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.rentalDate]);

  const availableBooks = books.filter(book => book.availableCopies > 0);
  const activeUsers = users.filter(user => user.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rental: Omit<Rental, 'id'> = {
      ...formData,
      status: 'active',
    };
    addRental(rental);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      bookId: '',
      userId: '',
      rentalDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      notes: '',
    });
    setIsModalOpen(false);
  };

  const handleReturnBook = (rentalId: string) => {
    updateRental(rentalId, {
      status: 'returned',
      returnDate: new Date().toISOString(),
    });
  };

  const handleDeleteRental = (rentalId: string) => {
    if (confirm('¿Estás seguro de eliminar este registro de renta?')) {
      deleteRental(rentalId);
    }
  };

  const getStatusColor = (rental: Rental) => {
    if (rental.status === 'returned') return 'bg-blue-100 text-blue-800';
    if (rental.status === 'overdue') return 'bg-red-100 text-red-800';

    // Check if active rental is overdue
    const today = new Date();
    const dueDate = new Date(rental.dueDate);
    if (today > dueDate) return 'bg-red-100 text-red-800';

    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (rental: Rental) => {
    if (rental.status === 'returned') return 'Devuelto';
    if (rental.status === 'overdue') return 'Vencido';

    // Check if active rental is overdue
    const today = new Date();
    const dueDate = new Date(rental.dueDate);
    if (today > dueDate) return 'Vencido';

    return 'Activo';
  };

  const activeRentals = rentals.filter(r => r.status === 'active');
  const overdueRentals = rentals.filter(r => {
    if (r.status === 'returned') return false;
    const today = new Date();
    const dueDate = new Date(r.dueDate);
    return today > dueDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendar / Rentar Libros</h1>
          <p className="text-gray-600">Gestiona las rentas y devoluciones de libros</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Renta
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Rentas Activas</p>
            <p className="text-2xl font-bold text-gray-900">{activeRentals.length}</p>
          </div>

        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Libros Vencidos</p>
            <p className="text-2xl font-bold text-gray-900">{overdueRentals.length}</p>
          </div>

        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Rentas</p>
            <p className="text-2xl font-bold text-gray-900">{rentals.length}</p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Renta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Libro *
              </label>
              <select
                value={formData.bookId}
                onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Seleccionar libro...</option>
                {availableBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} - {book.author} ({book.availableCopies} disponibles)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario *
              </label>
              <select
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Seleccionar usuario...</option>
                {activeUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Renta *
                </label>
                <input
                  type="date"
                  value={formData.rentalDate}
                  onChange={(e) => setFormData({ ...formData, rentalDate: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Vencimiento *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Notas adicionales..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Registrar Renta
            </button>
          </form>
        </div>

        {/* Rentals List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Libros Agendados</h2>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {rentals.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No hay rentas registradas</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {rentals
                  .sort((a, b) => new Date(b.rentalDate).getTime() - new Date(a.rentalDate).getTime())
                  .map((rental) => {
                    const book = books.find(b => b.id === rental.bookId);
                    const user = users.find(u => u.id === rental.userId);
                    return (
                      <div key={rental.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {book?.title || 'Libro eliminado'}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              <User className="w-3 h-3 inline mr-1" />
                              {user?.name || 'Usuario eliminado'}
                            </p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(rental.rentalDate).toLocaleDateString()} -
                              {new Date(rental.dueDate).toLocaleDateString()}
                            </div>
                            {rental.notes && (
                              <p className="text-xs text-gray-500 mt-1">{rental.notes}</p>
                            )}
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rental)}`}>
                              {getStatusText(rental)}
                            </span>

                            <div className="flex space-x-1">
                              {rental.status === 'active' && (
                                <button
                                  onClick={() => handleReturnBook(rental.id)}
                                  className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                  title="Marcar como devuelto"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteRental(rental.id)}
                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                title="Eliminar renta"
                              >
                                <AlertCircle className="w-4 h-4" />
                              </button>
                            </div>
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

      {/* Modal for New Rental */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Nueva Renta</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Libro *
                  </label>
                  <select
                    value={formData.bookId}
                    onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar libro...</option>
                    {availableBooks.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title} - {book.author}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario *
                  </label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar usuario...</option>
                    {activeUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Crear Renta
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}