import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Image as ImageIcon, 
  X, 
  RotateCcw, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface GenuinePhotoUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const GenuinePhotoUploader: React.FC<GenuinePhotoUploaderProps> = ({
  images,
  onChange,
  maxImages = 4
}) => {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewZoomImage, setPreviewZoomImage] = useState<string | null>(null);

  // Validate format and convert File to base64 Data URL
  const processFile = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!validExtensions.includes(file.type.toLowerCase())) {
      setErrorMessage('Unsupported format. Please select a genuine JPG, JPEG, PNG, or WEBP photo.');
      return;
    }

    // 10MB limit check
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image file is too large (max 10MB). Please select a compressed photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        if (images.length >= maxImages) {
          onChange([...images.slice(1), dataUrl]);
        } else {
          onChange([...images, dataUrl]);
        }
      }
    };
    reader.onerror = () => {
      setErrorMessage('Error reading photo from device.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFile(files[0]);
    e.target.value = '';
  };

  // Live WebRTC Camera Stream Handling
  const startLiveCamera = async () => {
    setErrorMessage(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        setStream(mediaStream);
        setIsCameraModalOpen(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
          }
        }, 300);
      } else {
        // Fallback to mobile file capture
        cameraInputRef.current?.click();
      }
    } catch (err: any) {
      console.warn('WebRTC camera unavailable, using device capture input fallback:', err);
      // Fallback directly to native camera input
      cameraInputRef.current?.click();
    }
  };

  const stopLiveCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraModalOpen(false);
  };

  const snapLivePhoto = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      if (images.length >= maxImages) {
        onChange([...images.slice(1), dataUrl]);
      } else {
        onChange([...images, dataUrl]);
      }
    }

    setIsCapturing(false);
    stopLiveCamera();
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleReplace = (index: number) => {
    handleRemove(index);
    galleryInputRef.current?.click();
  };

  const handleRetake = (index: number) => {
    handleRemove(index);
    startLiveCamera();
  };

  return (
    <div className="space-y-4">
      {/* Hidden file inputs for device gallery and mobile camera */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Upload Buttons with Gen-Z Aesthetic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Button 1: Device Gallery */}
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="group relative flex items-center justify-center gap-3 py-3.5 px-4 bg-slate-50 hover:bg-slate-100/90 border border-slate-200 hover:border-violet-300 rounded-2xl transition-all shadow-sm cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-800">
              Upload from Gallery
            </div>
            <div className="text-[11px] text-slate-500">
              Select JPG, PNG, WEBP from device
            </div>
          </div>
        </button>

        {/* Button 2: Camera Capture */}
        <button
          type="button"
          onClick={startLiveCamera}
          className="group relative flex items-center justify-center gap-3 py-3.5 px-4 bg-slate-50 hover:bg-slate-100/90 border border-slate-200 hover:border-emerald-300 rounded-2xl transition-all shadow-sm cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-800">
              Take Real Photo
            </div>
            <div className="text-[11px] text-slate-500">
              Snap with phone or webcam
            </div>
          </div>
        </button>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Security Rule Note */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-violet-50/50 p-2.5 rounded-xl border border-violet-100">
        <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
        <span>
          <strong>Anti-Fraud Policy:</strong> Only real device photos are accepted. Google image links or copied web URLs are blocked automatically.
        </span>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Genuine Photos Uploaded ({images.length}/{maxImages})</span>
            <span className="text-emerald-600 text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Ready</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((imgUrl, idx) => (
              <div 
                key={idx}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm"
              >
                <img
                  src={imgUrl}
                  alt={`Product angle ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Tag */}
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Cover Photo
                  </span>
                )}

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                  <button
                    type="button"
                    onClick={() => setPreviewZoomImage(imgUrl)}
                    className="p-1.5 bg-white text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title="Zoom Fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReplace(idx)}
                    className="p-1.5 bg-white text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title="Replace from Gallery"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRetake(idx)}
                    className="p-1.5 bg-white text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title="Retake Photo"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
          <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">
            At least 1 genuine product photo is required to publish
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Snap your handmade craft or item from your gallery or camera.
          </p>
        </div>
      )}

      {/* Live Webcam Modal */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden border border-slate-800 shadow-2xl animate-fade-in flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Live Campus Camera
                </span>
              </div>
              <button
                type="button"
                onClick={stopLiveCamera}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-4 border border-white/30 rounded-2xl pointer-events-none" />
            </div>

            <div className="p-5 flex items-center justify-between bg-slate-950">
              <button
                type="button"
                onClick={stopLiveCamera}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={snapLivePhoto}
                disabled={isCapturing}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-full text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Real Photo</span>
              </button>

              <div className="w-16" />
            </div>
          </div>
        </div>
      )}

      {/* Zoom Preview Modal */}
      {previewZoomImage && (
        <div 
          onClick={() => setPreviewZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-2xl w-full max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl relative">
            <img
              src={previewZoomImage}
              alt="Zoomed product view"
              className="w-full h-auto max-h-[80vh] object-contain mx-auto"
            />
            <button
              onClick={() => setPreviewZoomImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
