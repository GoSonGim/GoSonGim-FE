import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-primary">
      <div className="h-[852px] w-[393px] overflow-hidden bg-white shadow-2xl">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
