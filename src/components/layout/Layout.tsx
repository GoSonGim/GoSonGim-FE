import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="bg-background-primary flex h-dvh items-center justify-center overflow-hidden">
      <div className="relative h-full w-[393px] overflow-hidden bg-white shadow-2xl">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
