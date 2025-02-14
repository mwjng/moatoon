// components/audio/AudioPlayer.jsx
import { useEffect, useRef } from 'react';
import { fetchAudio } from '../../api/audio';

const AudioPlayer = ({ audioType }) => {
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const playAudio = async () => {
      try {
        const response = await fetchAudio(audioType);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        audioRef.current.src = url;
        await audioRef.current.play();
      } catch (error) {
        console.error('오디오 재생 오류:', error);
      }
    };

    playAudio();

    return () => {
      // cleanup
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, [audioType]);

  return null;  // UI 렌더링 없음
};

export default AudioPlayer;