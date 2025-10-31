import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#D5D5D5]">
      <div className="bg-background-primary h-[852px] w-[393px] overflow-hidden shadow-2xl">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
