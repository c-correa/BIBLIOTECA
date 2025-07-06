import React, { useState } from 'react';
import { Search, BookOpen, Eye, Calendar, Filter } from 'lucide-react';
import { useData, Book } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function UserBookView() {
  const { books, addRental } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showRentalModal, setShowRentalModal] = useState(false);

  const genres = [...new Set(books.map(book => book.genre).filter(Boolean))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    return matchesSearch && matchesGenre && book.availableCopies > 0;
  });

  const handleRentBook = (book: Book) => {
    setSelectedBook(book);
    setShowRentalModal(true);
  };

  const confirmRental = () => {
    if (selectedBook && user) {
      const rentalDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      addRental({
        bookId: selectedBook.id,
        userId: user.id,
        rentalDate,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'active',
        notes: '',
      });

      setShowRentalModal(false);
      setSelectedBook(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Catálogo de Libros</h1>
        <p className="text-gray-600">Explora y renta libros disponibles</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar libros por título o autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="">Todos los géneros</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <button
                onClick={() => setSelectedBook(book)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-gray-600 mb-2">{book.author}</p>
            <p className="text-sm text-gray-500 mb-3">{book.genre} • {book.publishedYear}</p>

            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-gray-600">
                Disponibles: <span className="font-medium text-green-600">{book.availableCopies}</span>
              </span>
            </div>

            <button
              onClick={() => handleRentBook(book)}
              disabled={book.availableCopies === 0}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {book.availableCopies > 0 ? 'Rentar Libro' : 'No Disponible'}
            </button>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">
            {searchTerm || selectedGenre ? 'No se encontraron libros' : 'No hay libros disponibles'}
          </p>
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && !showRentalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Detalles del Libro</h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedBook.title}</h3>
                  <p className="text-gray-600">{selectedBook.author}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Género:</span>
                    <div className="font-medium">{selectedBook.genre || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Año:</span>
                    <div className="font-medium">{selectedBook.publishedYear}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Disponibles:</span>
                    <div className="font-medium text-green-600">{selectedBook.availableCopies}</div>
                  </div>
                </div>

                {selectedBook.description && (
                  <div>
                    <span className="text-gray-500 text-sm">Descripción:</span>
                    <p className="text-gray-700 mt-1">{selectedBook.description}</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => handleRentBook(selectedBook)}
                    disabled={selectedBook.availableCopies === 0}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Rentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rental Confirmation Modal */}
      {showRentalModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Confirmar Renta</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">{selectedBook.title}</h3>
                  <p className="text-gray-600">{selectedBook.author}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha de renta:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha de devolución:</span>
                    <span className="font-medium">
                      {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Período:</span>
                    <span className="font-medium">14 días</span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowRentalModal(false);
                      setSelectedBook(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmRental}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Confirmar Renta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}