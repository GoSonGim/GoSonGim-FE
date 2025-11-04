import { createBrowserRouter } from 'react-router-dom';

import Home from '@/pages/home/Home';
import Login from '@/pages/login/Login';
import LoginForm from '@/pages/loginForm/LoginForm';
import SignupForm from '@/pages/signupForm/SignupForm';
import NicknamePage from '@/pages/nickname/NicknamePage';
import GoogleCallback from '@/pages/auth/GoogleCallback';
import Search from '@/pages/search/Search';
import Review from '@/pages/review/Review';
import Profile from '@/pages/profile/Profile';
import FreeTalkIntro from '@/pages/freetalk/FreeTalkIntro';
import FreeTalk from '@/pages/freetalk/FreeTalk';
import HomeStudyTalk from '@/pages/studytalk/HomeStudyTalk';

import Layout from '@/components/layout/Layout';
import RequireAuth from '@/components/router/RequireAuth';

export const router = createBrowserRouter([
  // 퍼블릭 라우트 (인증 불필요, Layout 포함)
  {
    element: <Layout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/login/email', element: <LoginForm /> },
      { path: '/signup/email', element: <SignupForm /> },
      { path: '/callback', element: <GoogleCallback /> },
    ],
  },

  // 인증 필요한 영역 (Layout 포함)
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/signup/nickname', element: <NicknamePage /> },
          { path: '/search', element: <Search /> },
          { path: '/review', element: <Review /> },
          { path: '/profile', element: <Profile /> },
          { path: '/freetalk/intro', element: <FreeTalkIntro /> },
          { path: '/freetalk', element: <FreeTalk /> },
          { path: '/studytalk', element: <HomeStudyTalk /> },
        ],
      },
    ],
  },
]);
