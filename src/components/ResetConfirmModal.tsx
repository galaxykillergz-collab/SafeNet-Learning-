import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-rose-100 p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 mx-auto mb-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          ยืนยันการรีเซ็ตข้อมูลทั้งหมด?
        </h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          การดำเนินการนี้จะล้างประวัติการอ่านบทเรียน คะแนนแบบทดสอบทั้ง 7 หน่วย และผลแบบประเมินความคิดเห็นทั้งหมดใน LocalStorage ให้กลับเป็นค่าเริ่มต้น
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>รีเซ็ตข้อมูล</span>
          </button>
        </div>
      </div>
    </div>
  );
};
