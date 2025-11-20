import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="bg-background-primary flex min-h-screen items-center justify-center">
      <div className="relative h-[852px] w-[393px] overflow-hidden bg-white shadow-2xl">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
