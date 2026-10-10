import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";

interface UseMusicPlayerOptions {
  firstTrack: string;
  secondTrack: string;
}

export function useMusicPlayer({
  firstTrack,
  secondTrack,
}: UseMusicPlayerOptions) {
  const firstAudioRef = useRef<HTMLAudioElement | null>(null);
  const secondAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<1 | 2>(1);
  const lastVolumeRef = useRef(0.25);
  const hidePanelTimerRef = useRef<number | null>(null);

  const [volume, setVolume] = useState(0.25);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicAllowed, setMusicAllowed] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  useEffect(() => {
    const firstAudio = new Audio(firstTrack);
    const secondAudio = new Audio(secondTrack);
    firstAudioRef.current = firstAudio;
    secondAudioRef.current = secondAudio;

    const playNextTrack = () => {
      const nextTrack =
        currentTrackRef.current === 1 ? secondAudio : firstAudio;
      currentTrackRef.current = currentTrackRef.current === 1 ? 2 : 1;
      nextTrack.currentTime = 0;
      nextTrack.play().catch((error: Error) => {
        if (error.name !== "AbortError") console.error(error);
      });
    };

    firstAudio.addEventListener("ended", playNextTrack);
    secondAudio.addEventListener("ended", playNextTrack);

    return () => {
      firstAudio.removeEventListener("ended", playNextTrack);
      secondAudio.removeEventListener("ended", playNextTrack);
      firstAudio.pause();
      secondAudio.pause();
    };
  }, [firstTrack, secondTrack]);

  useEffect(() => {
    if (firstAudioRef.current) firstAudioRef.current.volume = volume;
    if (secondAudioRef.current) secondAudioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (volume !== 0 || !isPlaying) return;

    const timer = window.setTimeout(() => {
      firstAudioRef.current?.pause();
      secondAudioRef.current?.pause();
      setIsPlaying(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isPlaying, volume]);

  useEffect(
    () => () => {
      if (hidePanelTimerRef.current)
        window.clearTimeout(hidePanelTimerRef.current);
    },
    [],
  );

  const playMusic = useCallback(
    async (requestedVolume = volume) => {
      const firstAudio = firstAudioRef.current;
      const secondAudio = secondAudioRef.current;
      if (!firstAudio || !secondAudio) return;

      firstAudio.volume = requestedVolume;
      secondAudio.volume = requestedVolume;
      const currentAudio =
        currentTrackRef.current === 1 ? firstAudio : secondAudio;

      try {
        await currentAudio.play();
        setIsPlaying(true);
        setMusicAllowed(true);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError")
          console.error(error);
      }
    },
    [volume],
  );

  const toggleMusic = useCallback(() => {
    const firstAudio = firstAudioRef.current;
    const secondAudio = secondAudioRef.current;
    if (!firstAudio || !secondAudio) return;

    if (volume > 0) {
      lastVolumeRef.current = volume;
      setVolume(0);
      firstAudio.pause();
      secondAudio.pause();
      setIsPlaying(false);
      return;
    }

    const nextVolume = lastVolumeRef.current || 0.25;
    setVolume(nextVolume);
    if (musicAllowed) void playMusic(nextVolume);
  }, [musicAllowed, playMusic, volume]);

  const handleVolumeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      const nextVolume = Number(event.target.value);
      setVolume(nextVolume);
      if (nextVolume > 0 && !isPlaying && musicAllowed)
        void playMusic(nextVolume);
    },
    [isPlaying, musicAllowed, playMusic],
  );

  const handleToggle = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (window.innerWidth <= 600) {
        setIsPanelExpanded((previous) => {
          if (!previous) {
            if (hidePanelTimerRef.current)
              window.clearTimeout(hidePanelTimerRef.current);
            hidePanelTimerRef.current = window.setTimeout(
              () => setIsPanelExpanded(false),
              4000,
            );
          } else if (hidePanelTimerRef.current) {
            window.clearTimeout(hidePanelTimerRef.current);
          }
          return !previous;
        });
      }
      toggleMusic();
    },
    [toggleMusic],
  );

  return {
    isMuted: volume === 0,
    isPanelExpanded,
    isPlaying,
    volume,
    handleToggle,
    handleVolumeChange,
    playMusic,
  };
}
