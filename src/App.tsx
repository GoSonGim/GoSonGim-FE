import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/home/Home';
import Login from '@/pages/login/Login';
import LoginForm from '@/pages/loginForm/LoginForm';
import SignupForm from '@/pages/signupForm/SignupForm';
import NicknamePage from '@/pages/nickname/NicknamePage';
import GoogleCallback from '@/pages/auth/GoogleCallback';
import Search from '@/pages/search/Search';
import Review from '@/pages/review/Review';
import Profile from '@/pages/profile/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 구글 OAuth Callback - Layout 없이 처리 */}
        <Route path="/callback" element={<GoogleCallback />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/email" element={<LoginForm />} />
          <Route path="/signup/email" element={<SignupForm />} />
          <Route path="/signup/nickname" element={<NicknamePage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/review" element={<Review />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
