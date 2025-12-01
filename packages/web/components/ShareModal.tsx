import React from 'react';
import { X, Share2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareContent: {
    title: string;
    description?: string;
    imageUrl?: string;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareContent }) => {
  if (!isOpen) return null;

  const handleShare = (platform: 'wechat' | 'moments' | 'qq' | 'qzone') => {
    // 这里实现分享逻辑
    // 在实际应用中,需要调用相应的SDK或跳转到分享URL
    
    const shareData = {
      title: shareContent.title,
      text: shareContent.description || '',
      url: window.location.href,
    };

    switch (platform) {
      case 'wechat':
        // 微信分享
        alert('正在跳转到微信分享...\n' + shareContent.title);
        // 实际实现: 调用微信SDK或生成分享链接
        break;
      case 'moments':
        // 朋友圈分享
        alert('正在跳转到微信朋友圈...\n' + shareContent.title);
        break;
      case 'qq':
        // QQ分享
        const qqUrl = `mqqapi://share/to_fri?src_type=web&version=1&file_type=news&req_type=1&title=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}`;
        window.location.href = qqUrl;
        break;
      case 'qzone':
        // QQ空间分享
        const qzoneUrl = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}&desc=${encodeURIComponent(shareData.text)}`;
        window.open(qzoneUrl, '_blank');
        break;
    }
    
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('链接已复制到剪贴板');
    onClose();
  };

  const handleSaveImage = () => {
    // 这里实现保存图片的逻辑
    alert('图片保存功能开发中...');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* 分享面板 */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl animate-slideUp">
        {/* 顶部把手 */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 标题 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">分享到...</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 分享选项网格 */}
        <div className="p-6 grid grid-cols-4 gap-6">
          {/* 微信好友 */}
          <button
            onClick={() => handleShare('wechat')}
            className="flex flex-col items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 8.5c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1zM5.5 8.5c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1zM9.7 4.1C6.1 4.1 3.2 6.5 3.2 9.5c0 1.7 1 3.2 2.5 4.2l-.7 2.1 2.4-1.2c.7.1 1.4.2 2.2.2h.2c-.1-.4-.2-.9-.2-1.3 0-3.1 2.9-5.7 6.4-5.7.3 0 .6 0 .9.1-.7-2.3-3.2-3.8-6.2-3.8z"/>
                <path d="M16 11.5c-2.8 0-5 1.9-5 4.2s2.2 4.2 5 4.2c.6 0 1.2-.1 1.8-.2l1.9 1-.6-1.7c1.2-.8 2-2.1 2-3.4 0-2.3-2.2-4.1-5.1-4.1zm-2.5 3.2c0-.5.4-.9.9-.9s.9.4.9.9-.4.9-.9.9-.9-.4-.9-.9zm4.5.9c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-700">微信好友</span>
          </button>

          {/* 朋友圈 */}
          <button
            onClick={() => handleShare('moments')}
            className="flex flex-col items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
                <circle cx="12" cy="7" r="1" fill="currentColor"/>
                <circle cx="12" cy="17" r="1" fill="currentColor"/>
                <circle cx="7" cy="12" r="1" fill="currentColor"/>
                <circle cx="17" cy="12" r="1" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-xs text-gray-700">朋友圈</span>
          </button>

          {/* QQ好友 */}
          <button
            onClick={() => handleShare('qq')}
            className="flex flex-col items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C9.2 2 7 4.2 7 7v3.5c-1.4.3-2.5 1.5-2.5 3 0 1 .5 1.9 1.2 2.5-.3.8-.7 1.7-.7 2.5 0 2.2 1.8 4 4 4h6c2.2 0 4-1.8 4-4 0-.8-.4-1.7-.7-2.5.7-.6 1.2-1.5 1.2-2.5 0-1.5-1.1-2.7-2.5-3V7c0-2.8-2.2-5-5-5zm0 2c1.7 0 3 1.3 3 3v3h-6V7c0-1.7 1.3-3 3-3z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-700">QQ好友</span>
          </button>

          {/* QQ空间 */}
          <button
            onClick={() => handleShare('qzone')}
            className="flex flex-col items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.5 4.5 10 10 10s10-4.5 10-10V7l-10-5zm0 2.2l7 3.5v7.8c0 3.9-3.1 7-7 7s-7-3.1-7-7V7.7l7-3.5z"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-xs text-gray-700">QQ空间</span>
          </button>

          {/* 复制链接 */}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-14 h-14 bg-gray-500 rounded-2xl flex items-center justify-center shadow-lg">
              <LinkIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-gray-700">复制链接</span>
          </button>

          {/* 保存图片 */}
          <button
            onClick={handleSaveImage}
            className="flex flex-col items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <ImageIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-gray-700">保存图片</span>
          </button>
        </div>

        {/* 底部安全区域 */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default ShareModal;
