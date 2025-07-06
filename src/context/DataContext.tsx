import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  availableCopies: number;
  totalCopies: number;
  description: string;
  createdAt: string;
}

export interface LibraryUser {
  id: string;
  name: string;
  email: string;
}

export interface Rental {
  id: string;
  bookId: string;
  userId: string;
  rentalDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  notes?: string;
}

interface DataContextType {
  books: Book[];
  users: LibraryUser[];
  rentals: Rental[];
  addBook: (book: Omit<Book, 'id' | 'createdAt'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addUser: (user: Omit<LibraryUser, 'id'>) => void;
  updateUser: (id: string, user: Partial<LibraryUser>) => void;
  deleteUser: (id: string) => void;
  addRental: (rental: Omit<Rental, 'id'>) => void;
  updateRental: (id: string, rental: Partial<Rental>) => void;
  deleteRental: (id: string) => void;
  getBookById: (id: string) => Book | undefined;
  getUserById: (id: string) => LibraryUser | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<LibraryUser[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBooks = localStorage.getItem('library_books');
    const savedUsers = localStorage.getItem('library_users');
    const savedRentals = localStorage.getItem('library_rentals');

    if (savedBooks) setBooks(JSON.parse(savedBooks));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedRentals) setRentals(JSON.parse(savedRentals));
  }, []);

  // Save books to localStorage whenever books change
  useEffect(() => {
    localStorage.setItem('library_books', JSON.stringify(books));
  }, [books]);

  // Save users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('library_users', JSON.stringify(users));
  }, [users]);

  // Save rentals to localStorage whenever rentals change
  useEffect(() => {
    localStorage.setItem('library_rentals', JSON.stringify(rentals));
  }, [rentals]);

  // Book operations
  const addBook = (book: Omit<Book, 'id' | 'createdAt'>) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, updatedBook: Partial<Book>) => {
    setBooks(prev => prev.map(book =>
      book.id === id ? { ...book, ...updatedBook } : book
    ));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
    // Also remove related rentals
    setRentals(prev => prev.filter(rental => rental.bookId !== id));
  };

  // User operations
  const addUser = (user: Omit<LibraryUser, 'id'>) => {
    const newUser: LibraryUser = {
      ...user,
      id: Date.now().toString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updatedUser: Partial<LibraryUser>) => {
    setUsers(prev => prev.map(user =>
      user.id === id ? { ...user, ...updatedUser } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    // Also remove related rentals
    setRentals(prev => prev.filter(rental => rental.userId !== id));
  };

  // Rental operations
  const addRental = (rental: Omit<Rental, 'id'>) => {
    const newRental: Rental = {
      ...rental,
      id: Date.now().toString(),
    };
    setRentals(prev => [...prev, newRental]);

    // Update book availability
    setBooks(prev => prev.map(book =>
      book.id === rental.bookId
        ? { ...book, availableCopies: Math.max(0, book.availableCopies - 1) }
        : book
    ));
  };

  const updateRental = (id: string, updatedRental: Partial<Rental>) => {
    const oldRental = rentals.find(r => r.id === id);
    setRentals(prev => prev.map(rental =>
      rental.id === id ? { ...rental, ...updatedRental } : rental
    ));

    // If returning a book, update availability
    if (oldRental && updatedRental.status === 'returned' && oldRental.status !== 'returned') {
      setBooks(prev => prev.map(book =>
        book.id === oldRental.bookId
          ? { ...book, availableCopies: book.availableCopies + 1 }
          : book
      ));
    }
  };

  const deleteRental = (id: string) => {
    const rental = rentals.find(r => r.id === id);
    setRentals(prev => prev.filter(rental => rental.id !== id));

    // If deleting an active rental, restore book availability
    if (rental && rental.status === 'active') {
      setBooks(prev => prev.map(book =>
        book.id === rental.bookId
          ? { ...book, availableCopies: book.availableCopies + 1 }
          : book
      ));
    }
  };

  // Utility functions
  const getBookById = (id: string) => books.find(book => book.id === id);
  const getUserById = (id: string) => users.find(user => user.id === id);

  return (
    <DataContext.Provider value={{
      books,
      users,
      rentals,
      addBook,
      updateBook,
      deleteBook,
      addUser,
      updateUser,
      deleteUser,
      addRental,
      updateRental,
      deleteRental,
      getBookById,
      getUserById,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}