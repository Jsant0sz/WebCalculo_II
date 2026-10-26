import React, { useState } from 'react';
import { AcademicData } from '../types';
import { initialAcademicData } from '../data/courseData';
import { X, Check, RotateCcw, GraduationCap, Building2, BookOpen, User, Calendar, Award } from 'lucide-react';

interface AcademicDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicData: AcademicData;
  onSave: (newData: AcademicData) => void;
}

export const AcademicDataModal: React.FC<AcademicDataModalProps> = ({
  isOpen,
  onClose,
  academicData,
  onSave,
}) => {
  const [formData, setFormData] = useState<AcademicData>(academicData);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof AcademicData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setFormData(initialAcademicData);
    onSave(initialAcademicData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#151922] border border-[#343946] rounded-2xl shadow-[0_0_30px_rgba(255,159,67,0.12)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#343946] bg-[#0B0D12]/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0B0D12] border border-[#FF9F43]/40 flex items-center justify-center text-[#FF9F43]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F5]">Datos Académicos</h3>
              <p className="text-xs text-[#B8BEC9]">Ingresa tus datos de estudiante y asignatura</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B8BEC9] hover:text-[#F5F5F5] hover:bg-[#343946]/50 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-[#151922]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#B8BEC9] mb-1">
                <User className="w-3.5 h-3.5 text-[#FF9F43]" />
                Nombre del Estudiante / Autor
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => handleChange('studentName', e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#0B0D12] border border-[#343946] rounded-lg text-sm text-[#F5F5F5] placeholder-[#B8BEC9]/50 focus:outline-none focus:border-[#FF9F43] font-medium"
                placeholder="Ej. Julio Santos"
              />
            </div>

            {/* Student ID / Carné */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#B8BEC9] mb-1">
                <Award className="w-3.5 h-3.5 text-[#FF9F43]" />
                Carné / Matrícula
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => handleChange('studentId', e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#0B0D12] border border-[#343946] rounded-lg text-sm text-[#F5F5F5] placeholder-[#B8BEC9]/50 focus:outline-none focus:border-[#FF9F43] font-mono"
                placeholder="Ej. 1990-22-1045"
              />
            </div>

            {/* University */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#B8BEC9] mb-1">
                <Building2 className="w-3.5 h-3.5 text-[#FF9F43]" />
                Universidad / Institución
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => handleChange('university', e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#0B0D12] border border-[#343946] rounded-lg text-sm text-[#F5F5F5] placeholder-[#B8BEC9]/50 focus:outline-none focus:border-[#FF9F43]"
                placeholder="Ej. Universidad Mariano Gálvez de Guatemala"
              />
            </div>

            {/* Faculty */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#B8BEC9] mb-1">
                <Building2 className="w-3.5 h-3.5 text-[#FF9F43]" />
                Facultad o Escuela
              </label>
              <input
                type="text"
                value={formData.faculty}
                onChange={(e) => handleChange('faculty', e.target.value)}
                className="w-full px-3 py-2 bg-[#0B0D12] border border-[#343946] rounded-lg text-sm text-[#F5F5F5] placeholder-[#B8BEC9]/50 focus:outline-none focus:border-[#FF9F43]"
                placeholder="Facultad de Ingeniería"
              />
            </div>

            {/* Course */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#B8BEC9] mb-1">
                <BookOpen className="w-3.5 h-3.5 text-[#FF9F43]" />
                Asignatura / Curso
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => handleChange('course', e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#0B0D12] border border-[#343946] rounded-lg text-sm text-[#F5F5F5] placeholder-[#B8BEC9]/50 focus:outline-none focus:border-[#FF9F43]"
                placeholder="Cálculo Integral"
              />
            </div>

            {/* Professor */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#B8BEC9] mb-1">
                <User className="w-3.5 h-3.5 text-[#FF9F43]" />
                Catedrático / Asesor
              </label>
              <input
                type="text"
                value={formData.professor}
                onChange={(e) => handleChange('professor', e.target.value)}
                className="w-full px-3 py-2 bg-[#0B0D12] border border-[#343946] rounded-lg text-sm text-[#F5F5F5] placeholder-[#B8BEC9]/50 focus:outline-none focus:border-[#FF9F43]"
                placeholder="Nombre del Docente"
              />
            </div>

            {/* Term */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#B8BEC9] mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#FF9F43]" />
                Ciclo / Fecha
              </label>
              <input
                type="text"
                value={formData.academicTerm}
                onChange={(e) => handleChange('academicTerm', e.target.value)}
                className="w-full px-3 py-2 bg-[#0B0D12] border border-[#343946] rounded-lg text-sm text-[#F5F5F5] placeholder-[#B8BEC9]/50 focus:outline-none focus:border-[#FF9F43]"
                placeholder="Primer Semestre 2026"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#343946]">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-[#B8BEC9] hover:text-[#F5F5F5] transition-colors px-2 py-1.5 rounded hover:bg-[#343946]/40 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer por defecto</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#B8BEC9] hover:text-[#F5F5F5] rounded-lg hover:bg-[#343946]/40 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-[#0B0D12] bg-[#FF9F43] hover:bg-[#FFC078] rounded-lg shadow-[0_0_12px_rgba(255,159,67,0.25)] transition-all cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-[#0B0D12] font-bold" />
                    <span>¡Guardado!</span>
                  </>
                ) : (
                  <span>Guardar cambios</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
