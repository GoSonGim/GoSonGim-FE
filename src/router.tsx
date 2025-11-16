import { createBrowserRouter } from 'react-router-dom';

import Home from '@/pages/home/Home';
import Login from '@/pages/login/Login';
import LoginForm from '@/pages/loginForm/LoginForm';
import SignupForm from '@/pages/signupForm/SignupForm';
import NicknamePage from '@/pages/nickname/NicknamePage';
import GoogleCallback from '@/pages/auth/GoogleCallback';
import Search from '@/pages/search/Search';
import Review from '@/pages/review/Review';
import ReviewCalendar from '@/pages/review/ReviewCalendar';
import ReviewPractice from '@/pages/review/practice/ReviewPractice';
import ReviewPracticeListen from '@/pages/review/practice/ReviewPracticeListen';
import ArticulationPracticeListen from '@/pages/review/practice/ArticulationPracticeListen';
import WordQuiz from '@/pages/review/words/WordQuiz';
import WordListPage from '@/pages/review/words/WordListPage';
import Profile from '@/pages/profile/Profile';
import ProfileWordListPage from '@/pages/profile/WordListPage';
import ProfileGuide from '@/pages/profile/ProfileGuide';
import AccountSettings from '@/pages/profile/AccountSettings';
import FreeTalkIntro from '@/pages/freetalk/FreeTalkIntro';
import FreeTalk from '@/pages/freetalk/FreeTalk';
import HomeStudyTalk from '@/pages/studytalk/HomeStudyTalk';
import TalkingKit from '@/pages/talkingkit/TalkingKit';
import KitDetail from '@/pages/talkingkit/KitDetail';
import BreathingExercise from '@/pages/talkingkit/breathing/BreathingExercise';
import VowelPitch from '@/pages/talkingkit/vowelPitch/VowelPitch';
import VowelPitchResult from '@/pages/talkingkit/vowelPitch/VowelPitchResult';
import SteadySound from '@/pages/talkingkit/steadySound/SteadySound';
import ShortSound from '@/pages/talkingkit/shortSound/ShortSound';
import LoudSound from '@/pages/talkingkit/loudSound/LoudSound';
import LoudSoundVolume from '@/pages/talkingkit/loudSound/LoudSoundVolume';
import LoudSoundVolumeResult from '@/pages/talkingkit/loudSound/LoudSoundVolumeResult';

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
          { path: '/review/calendar', element: <ReviewCalendar /> },
          { path: '/review/practice', element: <ReviewPractice /> },
          { path: '/review/practice/listen', element: <ReviewPracticeListen /> },
          { path: '/review/practice/articulation-listen', element: <ArticulationPracticeListen /> },
          { path: '/review/word-quiz', element: <WordQuiz /> },
          { path: '/review/word-list', element: <WordListPage /> },
          { path: '/profile', element: <Profile /> },
          { path: '/profile/words', element: <ProfileWordListPage /> },
          { path: '/profile/guide', element: <ProfileGuide /> },
          { path: '/profile/account-settings', element: <AccountSettings /> },
          { path: '/freetalk/intro', element: <FreeTalkIntro /> },
          { path: '/freetalk', element: <FreeTalk /> },
          { path: '/studytalk', element: <HomeStudyTalk /> },
          { path: '/talkingkit', element: <TalkingKit /> },
          { path: '/talkingkit/:id', element: <KitDetail /> },
          { path: '/talkingkit/:id/breathing', element: <BreathingExercise /> },
          { path: '/talkingkit/:id/steady-sound', element: <SteadySound /> },
          { path: '/talkingkit/:id/short-sound', element: <ShortSound /> },
          { path: '/talkingkit/:id/loud-sound', element: <LoudSound /> },
          { path: '/talkingkit/:id/loud-sound-volume', element: <LoudSoundVolume /> },
          { path: '/talkingkit/:id/loud-sound-volume/result', element: <LoudSoundVolumeResult /> },
          { path: '/talkingkit/vowel-pitch', element: <VowelPitch /> },
          { path: '/talkingkit/vowel-pitch/result', element: <VowelPitchResult /> },
        ],
      },
    ],
  },
]);
