import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Teeno alag navbars ko import karein (hum inko next step mein banayenge)
import AdminNavbar from './AdminNavbar';
import InstructorNavbar from './InstructorNavbar';
import StudentNavbar from './StudentNavbar';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  // Agar user logged in nahi hai, toh default (Student/Public) Navbar dikhao
  if (!user) {
    return <StudentNavbar />;
  }

  // Role ke hisaab se sahi Navbar render karein
  if (user.role === 'admin') {
    return <AdminNavbar />;
  } 
  
  if (user.role === 'instructor') {
    return <InstructorNavbar />;
  }

  // Default student ke liye
  return <StudentNavbar />;
};

export default Navbar;