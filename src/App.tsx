import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/home/Home';
import Login from '@/pages/login/Login';
import Search from '@/pages/search/Search';
import Review from '@/pages/review/Review';
import Profile from '@/pages/profile/Profile';
import HomeStudyTalk from '@/pages/home/studytalk/HomeStudyTalk';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/review" element={<Review />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/studytalk" element={<HomeStudyTalk />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
