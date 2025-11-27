import BottomNav from '@/components/common/BottomNav';
import HomeHeader from '@/components/home/Header';
import HomeWelcome from '@/components/home/Welcome';
import HomeMyStudy from '@/components/home/MyStudy';
import HomeStudyPractice from '@/components/home/StudyPractice';
import HomeMoreContents from '@/components/home/MoreContents';

const Home = () => {
  return (
    <div className="relative bg-background-primary flex h-full flex-col">
      <HomeHeader />
      <main className="flex-1 overflow-y-auto px-4 pt-10 pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
