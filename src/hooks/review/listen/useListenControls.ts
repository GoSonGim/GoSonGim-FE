import { useState } from 'react';
import { useAudioPlayer } from '../useAudioPlayer';

export const useListenControls = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { loadAudio, play, pause, seekForward, seekBackward, isPlaying, progress } = useAudioPlayer();

  const handleItemClick = (id: number, audioUrl: string) => {
    setSelectedId(id);
    loadAudio(audioUrl);
    play();
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handlePrevious = () => {
    seekBackward(5);
  };

  const handleNext = () => {
    seekForward(5);
  };

  return {
    selectedId,
    isPlaying,
    progress,
    handleItemClick,
    handlePlayPause,
    handlePrevious,
    handleNext,
  };
};
