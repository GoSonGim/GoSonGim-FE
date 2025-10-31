import BottomNav from '@/components/common/BottomNav';
import HomeHeader from '@/pages/home/HomeHeader';
import HomeWelcome from '@/pages/home/HomeWelcome';
import HomeMyStudy from '@/pages/home/HomeMyStudy';
import HomeStudyPractice from '@/pages/home/HomeStudyPractice';
import HomeMoreContents from '@/pages/home/HomeMoreContents';

const Home = () => {
  return (
    <div className="relative bg-background-primary flex h-full flex-col">
      <HomeHeader />
      <main className="flex-1 overflow-y-auto px-4 pt-10 pb-40 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <HomeWelcome />
        <HomeMyStudy className="mt-10" />
        <HomeStudyPractice className="mt-10" />
        <HomeMoreContents className="mt-10" />
      </main>
      <BottomNav />
    </div>
  );
};

export default Home;
