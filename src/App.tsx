import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/home/Home';
import Login from '@/pages/login/Login';
import Search from '@/pages/search/Search';
import Review from '@/pages/review/Review';
import Profile from '@/pages/profile/Profile';
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
          <Route path="/talkingkit" element={<TalkingKit />} />
          <Route path="/talkingkit/:id" element={<KitDetail />} />
          <Route path="/talkingkit/:id/breathing" element={<BreathingExercise />} />
          <Route path="/talkingkit/:id/steady-sound" element={<SteadySound />} />
          <Route path="/talkingkit/:id/short-sound" element={<ShortSound />} />
          <Route path="/talkingkit/:id/loud-sound" element={<LoudSound />} />
          <Route path="/talkingkit/:id/loud-sound-volume" element={<LoudSoundVolume />} />
          <Route path="/talkingkit/:id/loud-sound-volume/result" element={<LoudSoundVolumeResult />} />
          <Route path="/talkingkit/vowel-pitch" element={<VowelPitch />} />
          <Route path="/talkingkit/vowel-pitch/result" element={<VowelPitchResult />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
