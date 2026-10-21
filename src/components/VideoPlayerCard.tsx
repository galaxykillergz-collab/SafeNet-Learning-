import React, { useState, useEffect } from 'react';
import { VideoLesson, VideoSlide } from '../types';
import {
  Play,
  ExternalLink,
  Video,
  Clock,
  Sparkles,
  Award,
  PlusCircle,
  RotateCcw,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  RefreshCw,
  Search,
  ShieldCheck,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { getWatchedVideos, toggleVideoWatched } from '../utils/storage';

interface VideoPlayerCardProps {
  moduleId: number;
  moduleTitle: string;
  videos: VideoLesson[];
  onVideoWatchedChange?: (videoId: string, watched: boolean) => void;
}

export const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({
  moduleId,
  moduleTitle,
  videos,
  onVideoWatchedChange,
}) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [watchedList, setWatchedList] = useState<string[]>(getWatchedVideos());
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customVideoList, setCustomVideoList] = useState<VideoLesson[]>(videos);
  const [takeawayChecks, setTakeawayChecks] = useState<Record<string, boolean>>({});
  
  // Dual-mode playback: 'video' (YouTube iframe) or 'multimedia' (SafeNet Interactive Slide Deck)
  const [playerMode, setPlayerMode] = useState<'video' | 'multimedia'>('video');
  const [useBackupSource, setUseBackupSource] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sync when module changes
  useEffect(() => {
    setSelectedVideoIndex(0);
    setCustomVideoList(videos);
    setUseBackupSource(false);
    setActiveSlideIndex(0);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [moduleId, videos]);

  // Reset speech when changing video or mode
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setUseBackupSource(false);
    setActiveSlideIndex(0);
  }, [selectedVideoIndex, playerMode]);

  const currentVideo = customVideoList[selectedVideoIndex] || customVideoList[0];
  const isCurrentWatched = currentVideo ? watchedList.includes(currentVideo.id) : false;

  // Active YouTube ID (Primary or Backup mirror)
  const activeYoutubeId = useBackupSource && currentVideo?.backupYoutubeId
    ? currentVideo.backupYoutubeId
    : currentVideo?.youtubeId || '';

  // Helper to extract clean YouTube ID
  const getEmbedUrl = (youtubeIdOrUrl: string) => {
    if (!youtubeIdOrUrl) return '';
    let videoId = youtubeIdOrUrl.trim();

    if (videoId.includes('youtube.com/watch?v=')) {
      const parts = videoId.split('v=');
      videoId = parts[1]?.split('&')[0] || videoId;
    } else if (videoId.includes('youtu.be/')) {
      const parts = videoId.split('youtu.be/');
      videoId = parts[1]?.split('?')[0] || videoId;
    } else if (videoId.includes('youtube.com/embed/')) {
      const parts = videoId.split('embed/');
      videoId = parts[1]?.split('?')[0] || videoId;
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&origin=${encodeURIComponent(
      window.location.origin
    )}`;
  };

  const handleToggleWatched = () => {
    if (!currentVideo) return;
    const { watched, list } = toggleVideoWatched(currentVideo.id);
    setWatchedList(list);
    if (onVideoWatchedChange) {
      onVideoWatchedChange(currentVideo.id, watched);
    }
  };

  const handleAddCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    let extractedId = customUrl.trim();
    if (extractedId.includes('youtube.com/watch?v=')) {
      extractedId = extractedId.split('v=')[1]?.split('&')[0] || extractedId;
    } else if (extractedId.includes('youtu.be/')) {
      extractedId = extractedId.split('youtu.be/')[1]?.split('?')[0] || extractedId;
    }

    const newCustomVideo: VideoLesson = {
      id: `custom-${moduleId}-${Date.now()}`,
      title: customTitle.trim() || `คลิปวิดีโอเพิ่มเติมสำหรับหน่วยที่ ${moduleId}`,
      description: 'คลิปการเรียนรู้ที่ผู้ใช้/ผู้สอนเพิ่มเข้ามาประกอบการศึกษา',
      youtubeId: extractedId,
      duration: 'กำหนดเอง',
      source: 'คลิปเพิ่มเติมจากผู้ใช้ / คุณครู',
      tag: 'คลิปเสริมพิเศษ',
      keyTakeaways: [
        'เชื่อมโยงเนื้อหากับบทเรียน SafeNet Learning',
        'นำข้อคิดและแนวทางปฏิบัติไปประยุกต์ใช้ในการป้องกันภัยไซเบอร์',
      ],
      fallbackSlides: [
        {
          step: 1,
          title: customTitle.trim() || 'คลิปวิดีโอการเรียนรู้เพิ่มเติม',
          description: 'ศึกษาและทำความเข้าใจเนื้อหาจากคลิปที่เพิ่มเข้ามา โดยสังเกตแนวคิดและวิธีปฏิบัติที่ถูกต้อง',
          highlights: ['คลิปเสริม', 'ศึกษาประกอบบทเรียน'],
          actionItem: 'สรุปประเด็นสำคัญและนำไปปรับใช้ในชีวิตประจำวัน',
        },
      ],
    };

    const updated = [...customVideoList, newCustomVideo];
    setCustomVideoList(updated);
    setSelectedVideoIndex(updated.length - 1);
    setCustomUrl('');
    setCustomTitle('');
    setShowCustomInput(false);
  };

  const handleResetVideos = () => {
    setCustomVideoList(videos);
    setSelectedVideoIndex(0);
    setUseBackupSource(false);
  };

  const toggleTakeaway = (indexKey: string) => {
    setTakeawayChecks((prev) => ({
      ...prev,
      [indexKey]: !prev[indexKey],
    }));
  };

  // Text to speech for current slide
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const slides = currentVideo?.fallbackSlides || [];
    const currentSlide = slides[activeSlideIndex];
    if (!currentSlide) return;

    const speechText = `${currentSlide.title} ข้อความสรุป: ${currentSlide.description} แนวทางปฏิบัติ: ${currentSlide.actionItem}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'th-TH';
    utterance.rate = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (!currentVideo) return null;

  const slides: VideoSlide[] = currentVideo.fallbackSlides || [
    {
      step: 1,
      title: currentVideo.title,
      description: currentVideo.description,
      highlights: currentVideo.keyTakeaways || ['ประเด็นสำคัญประจำคลิป'],
      actionItem: 'นำความรู้ที่ได้รับไปปรับใช้ในการปกป้องตนเองบนโลกดิจิทัล',
    },
  ];

  const currentSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-indigo-900/40 space-y-6">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-amber-400 flex items-center justify-center shadow-md shrink-0 mt-0.5">
            {playerMode === 'video' ? (
              <Video className="w-5 h-5 text-white" />
            ) : (
              <Layers className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                มัลติมีเดียประกอบการเรียนรู้ (Video Lessons)
              </span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-medium">
                หน่วยที่ {moduleId}
              </span>
              {currentVideo.tag && (
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-medium">
                  {currentVideo.tag}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              {currentVideo.title}
            </h3>
          </div>
        </div>

        {/* Mode Switcher + Video Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Tabs */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setPlayerMode('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                playerMode === 'video'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>โหมดวิดีโอ</span>
            </button>
            <button
              onClick={() => setPlayerMode('multimedia')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                playerMode === 'multimedia'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>สื่อสรุป SafeNet</span>
            </button>
          </div>

          {/* Video Selector Buttons */}
          <div className="flex items-center gap-1.5">
            {customVideoList.map((vid, idx) => {
              const isWatched = watchedList.includes(vid.id);
              const isSelected = idx === selectedVideoIndex;

              return (
                <button
                  key={vid.id}
                  onClick={() => {
                    setSelectedVideoIndex(idx);
                    setUseBackupSource(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                      : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/15'
                  }`}
                >
                  <Play className={`w-3 h-3 ${isSelected ? 'fill-white' : ''}`} />
                  <span>คลิปที่ {idx + 1}</span>
                  {isWatched && <span className="text-emerald-400 text-[10px]">✓</span>}
                </button>
              );
            })}

            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
              title="เพิ่มลิงก์ YouTube ด้วยตนเอง"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline text-[11px]">เพิ่มคลิป</span>
            </button>

            {customVideoList.length > videos.length && (
              <button
                onClick={handleResetVideos}
                className="p-1.5 rounded-xl text-xs bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 transition"
                title="รีเซ็ตกลับเป็นคลิปตั้งต้น"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add Custom Video Form */}
      {showCustomInput && (
        <form
          onSubmit={handleAddCustomVideo}
          className="bg-white/10 border border-cyan-500/30 rounded-2xl p-4 space-y-3 text-xs"
        >
          <div className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>เพิ่มคลิปวิดีโอ YouTube ของคุณเองหรือจากอาจารย์ผู้สอน</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 text-[11px]">
                ลิงก์วิดีโอ YouTube (URL หรือ Video ID) *
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="เช่น https://www.youtube.com/watch?v=... หรือ ID"
                required
                className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 text-[11px]">
                ชื่อหัวข้อคลิปวิดีโอ (ระบุหรือไม่ก็ได้)
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="เช่น บรรยายพิเศษเรื่องความปลอดภัยไซเบอร์"
                className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowCustomInput(false)}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-slate-300 hover:bg-white/20"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-sm"
            >
              ยืนยันการเพิ่มคลิป
            </button>
          </div>
        </form>
      )}

      {/* Troubleshooting and Source Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {playerMode === 'video'
              ? 'หากคลิปขึ้น "Video unavailable" หรือถูกบล็อกจากเครือข่ายโรงเรียน/มหาวิทยาลัย:'
              : 'กำลังแสดงผลในโหมดสื่อมัลติมีเดีย SafeNet (อินเทอร์แอคทีฟ):'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {currentVideo.backupYoutubeId && playerMode === 'video' && (
            <button
              onClick={() => setUseBackupSource(!useBackupSource)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                useBackupSource
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/15'
              }`}
              title="สลับเป็นคลิปสำรองที่คัดสรรไว้"
            >
              <RefreshCw className={`w-3 h-3 ${useBackupSource ? 'animate-spin' : ''}`} />
              <span>{useBackupSource ? 'ใช้คลิปสำรอง (Active)' : 'สลับเป็นคลิปสำรอง'}</span>
            </button>
          )}

          {playerMode === 'video' ? (
            <button
              onClick={() => setPlayerMode('multimedia')}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 font-medium transition"
            >
              <Sparkles className="w-3 h-3" />
              <span>สลับเป็นสื่อสรุป SafeNet</span>
            </button>
          ) : (
            <button
              onClick={() => setPlayerMode('video')}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-medium transition"
            >
              <Video className="w-3 h-3" />
              <span>กลับสู่เครื่องเล่นวิดีโอ</span>
            </button>
          )}

          <a
            href={`https://www.youtube.com/watch?v=${activeYoutubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition"
            title="เปิดคลิปนี้บน YouTube โดยตรงในแท็บใหม่"
          >
            <ExternalLink className="w-3 h-3" />
            <span>ดูบน YouTube</span>
          </a>
        </div>
      </div>

      {/* Main Presentation Area */}
      {playerMode === 'video' ? (
        /* Video Mode (Responsive 16:9 Iframe) */
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 group">
          <iframe
            key={activeYoutubeId}
            src={getEmbedUrl(activeYoutubeId)}
            title={currentVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      ) : (
        /* Multimedia Mode (SafeNet Interactive Visual Presentation) */
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-cyan-500/30 p-5 sm:p-8 flex flex-col justify-between shadow-2xl">
          {/* Slide Header */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center font-bold text-xs">
                {currentSlide.step}
              </span>
              <span className="text-xs font-semibold text-cyan-300">
                สไลด์ที่ {activeSlideIndex + 1} จาก {slides.length}
              </span>
            </div>

            {/* Audio Speech Button */}
            {'speechSynthesis' in window && (
              <button
                onClick={handleToggleSpeech}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border transition ${
                  isSpeaking
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/15'
                }`}
                title="ฟังเสียงบรรยายสรุปเนื้อหา"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>หยุดเสียงบรรยาย</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                    <span>ฟังเสียงบรรยาย</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Slide Body */}
          <div className="space-y-4 my-auto py-2">
            <div>
              <h4 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                {currentSlide.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 max-w-3xl">
                {currentSlide.description}
              </p>
            </div>

            {/* Highlight Chips */}
            {currentSlide.highlights && currentSlide.highlights.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {currentSlide.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[11px] sm:text-xs bg-cyan-950/80 text-cyan-200 border border-cyan-500/30 px-3 py-1 rounded-lg font-medium shadow-sm"
                  >
                    ★ {h}
                  </span>
                ))}
              </div>
            )}

            {/* Action Item Box */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 sm:p-3.5 flex items-start gap-2.5 max-w-2xl">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  แนวทางปฏิบัติจริง (Practical Action):
                </span>
                <span className="text-xs text-amber-100 font-medium">
                  {currentSlide.actionItem}
                </span>
              </div>
            </div>
          </div>

          {/* Slide Footer with Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setActiveSlideIndex(dotIdx)}
                  className={`h-2 rounded-full transition-all ${
                    dotIdx === activeSlideIndex
                      ? 'w-6 bg-cyan-400'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`ไปยังสไลด์ที่ ${dotIdx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeSlideIndex === 0}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-white transition border border-white/10"
                title="สไลด์ก่อนหน้า"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))
                }
                disabled={activeSlideIndex === slides.length - 1}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-white transition border border-white/10"
                title="สไลด์ถัดไป"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Details & Interaction Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {currentVideo.source}
            </span>
            <span className="text-[11px] text-slate-300 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>ความยาว: {currentVideo.duration}</span>
            </span>
            {useBackupSource && (
              <span className="text-[10px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md font-medium border border-amber-400/20">
                สตรีมผ่านเซิร์ฟเวอร์สำรอง
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {currentVideo.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end flex-wrap">
          {currentVideo.searchQuery && (
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                currentVideo.searchQuery
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-white/10 hover:bg-white/20 text-slate-200 transition border border-white/10"
              title="ค้นหาคลิปนี้และคลิปที่เกี่ยวข้องบน YouTube"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ค้นหาบน YouTube</span>
            </a>
          )}

          <a
            href={`https://www.youtube.com/watch?v=${activeYoutubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-white/10 hover:bg-white/20 text-slate-200 transition border border-white/10"
            title="เปิดรับชมบน YouTube เต็มจอ"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">เปิดบน YouTube</span>
          </a>

          <button
            onClick={handleToggleWatched}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
              isCurrentWatched
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:brightness-110'
            }`}
          >
            {isCurrentWatched ? (
              <>
                <Check className="w-4 h-4" />
                <span>รับชมสื่อนี้เรียบร้อยแล้ว</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4 text-amber-200" />
                <span>บันทึกว่าเรียนรู้แล้ว (+แต้มสื่อการเรียน)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Key Takeaways Checklist */}
      {currentVideo.keyTakeaways && currentVideo.keyTakeaways.length > 0 && (
        <div className="bg-slate-950/60 rounded-2xl p-4 sm:p-5 border border-white/5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>ประเด็นสำคัญที่สังเกตได้จากคลิปวิดีโอ (Video Takeaways):</span>
            </div>
            <span className="text-[11px] text-slate-400">คลิกเพื่อติ๊กประเด็นที่คุณจดจำได้</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {currentVideo.keyTakeaways.map((takeaway, tIdx) => {
              const checkKey = `${currentVideo.id}-takeaway-${tIdx}`;
              const isChecked = takeawayChecks[checkKey] || isCurrentWatched;

              return (
                <button
                  key={tIdx}
                  type="button"
                  onClick={() => toggleTakeaway(checkKey)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 border ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-slate-500 bg-slate-800'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-xs leading-relaxed">{takeaway}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
