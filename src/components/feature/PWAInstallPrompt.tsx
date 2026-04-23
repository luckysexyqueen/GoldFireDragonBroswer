import { useState } from 'react';
import { usePWA } from '@/hooks/usePWA';

export default function PWAInstallPrompt() {
  const pwa = usePWA(); // 안전하게 받기
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // 에러 방지용 안전장치
  if (!pwa || pwa.isInstalled) return null;

  const { canInstall, isIOS, triggerInstall, dismiss } = pwa;

  if (!canInstall && !isIOS) return null;

  const handleInstall = async () => {
    try {
      await triggerInstall();
    } catch (e) {
      console.error(e);
    }
  };

  if (isIOS) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white p-4 rounded-2xl border border-yellow-400">
        <button onClick={() => setShowIOSGuide(true)} className="text-sm">
          iOS 설치 방법 보기
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white p-4 rounded-2xl border border-yellow-400">
      <button onClick={handleInstall} className="text-sm">
        앱 설치하기
      </button>
      <button onClick={dismiss} className="ml-4 text-xs opacity-70">
        나중에
      </button>
    </div>
  );
}