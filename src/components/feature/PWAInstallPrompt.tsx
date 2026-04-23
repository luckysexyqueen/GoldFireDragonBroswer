import { useState } from 'react';
import { usePWA } from '@/hooks/usePWA';

export default function PWAInstallPrompt() {
  const { canInstall, isIOS, isInstalled, platform, triggerInstall, dismiss } = usePWA();

  const [installing, setInstalling] = useState(false);
  const [done, setDone] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // 안전장치: 데이터가 없으면 아무것도 안그림
  if (isInstalled || done) return null;
  if (!canInstall && !isIOS) return null;

  const handleInstall = async () => {
    setInstalling(true);
    try {
      const outcome = await triggerInstall();
      if (outcome === 'accepted') setDone(true);
    } catch (err) {
      console.error('PWA Install Error:', err);
    } finally {
      setInstalling(false);
    }
  };

  const platformLabel = platform === 'ios-safari' ? 'iOS' :
    platform === 'android-chrome' ? 'Android' : 'Chrome';

  if (isIOS && showIOSGuide) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-sm bg-[#1a1a1a] border border-yellow-500/30 rounded-3xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-500 rounded-2xl flex items-center justify-center">
                <i className="ri-fire-line text-3xl text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">GoldFireDragon</p>
                <p className="text-yellow-400">홈 화면에 추가</p>
              </div>
            </div>

            <div className="space-y-5 text-sm">
              {[
                { n: 1, icon: "ri-share-forward-line", title: "공유 버튼 탭", desc: "하단 Safari 공유 버튼(□↑)을 탭하세요" },
                { n: 2, icon: "ri-add-box-line", title: "홈 화면에 추가", desc: "메뉴에서 '홈 화면에 추가'를 찾아 탭하세요" },
                { n: 3, icon: "ri-check-line", title: "추가 완료", desc: "우측 상단 '추가'를 탭하세요" }
              ].map(item => (
                <div key={item.n} className="flex gap-4">
                  <div className="w-8 h-8 rounded-2xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                    <i className={`${item.icon} text-yellow-400`} />
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-white/60 text-xs mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => { setShowIOSGuide(false); dismiss(); }}
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-medium"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] w-full max-w-[340px] px-4">
      <div className="bg-[#111] border border-yellow-500/30 rounded-3xl shadow-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-yellow-400 to-red-500" />

        <div className="p-5">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-500 rounded-2xl flex items-center justify-center shrink-0">
              <i className="ri-fire-line text-3xl text-white" />
            </div>
            <div className="flex-1 pt-1">
              <p className="text-lg font-bold text-white">GoldFireDragon 앱 설치</p>
              <p className="text-sm text-white/70 mt-1">{platformLabel}에서 앱처럼 사용하세요</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            {isIOS ? (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="flex-1 py-3.5 bg-gradient-to-r from-yellow-500 to-red-500 text-black font-semibold rounded-2xl text-sm active:scale-95 transition-all"
              >
                iOS 설치 방법 보기
              </button>
            ) : (
              <button
                onClick={handleInstall}
                disabled={installing}
                className="flex-1 py-3.5 bg-gradient-to-r from-yellow-500 to-red-500 text-black font-semibold rounded-2xl text-sm active:scale-95 transition-all disabled:opacity-70"
              >
                {installing ? "설치 중..." : "앱으로 설치"}
              </button>
            )}

            <button
              onClick={dismiss}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white/80 font-medium rounded-2xl text-sm transition-all"
            >
              나중에
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}