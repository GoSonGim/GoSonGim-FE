import { useState } from 'react';
import { useAudioPlayer } from '../useAudioPlayer';

export const useListenControls = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const {
    loadAndPlay,
    play,
    pause,
    seekForward,
    seekBackward,
    isPlaying,
    progress,
  } = useAudioPlayer();

  const handleItemClick = (id: number, audioUrl: string) => {
    setSelectedId(id);
    loadAndPlay(audioUrl); //  여기서 바로 src+load+play
  };

  const handlePlayPause = async() => {
    if (isPlaying) {
      pause();
    } else {
     await play();
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