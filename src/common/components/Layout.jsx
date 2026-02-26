import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}

export default Layout;
