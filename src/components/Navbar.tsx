import React, { useState } from 'react';
import { AcademicData } from '../types';
import { UserCheck, Menu, X } from 'lucide-react';

interface NavbarProps {
  academicData: AcademicData;
  onOpenAcademicModal: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  academicData,
  onOpenAcademicModal,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'aprende', label: 'Aprende' },
    { id: 'laboratorio', label: 'Laboratorio' },
    { id: 'videos', label: 'Videos' },
    { id: 'problemas', label: 'Problemas' },
    { id: 'practica', label: 'Practica' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#343946] bg-[#0B0D12]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#151922] border border-[#343946] flex items-center justify-center text-[#FF9F43] font-mono text-lg font-bold shadow-[0_0_10px_rgba(255,159,67,0.15)]">
            ∫
          </div>
          <button
            onClick={() => scrollTo('inicio')}
            className="text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-[#F5F5F5] group-hover:text-[#FF9F43] transition-colors text-base sm:text-lg">
                ÁREA ENTRE FUNCIONES
              </span>
            </div>
            <p className="text-[10px] text-[#B8BEC9] font-mono tracking-widest uppercase">
              Cálculo Integral · Minicurso
            </p>
          </button>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#FF9F43] bg-[#FF9F43]/10 border border-[#FF9F43]/30 shadow-[0_0_8px_rgba(255,159,67,0.12)]'
                    : 'text-[#B8BEC9] hover:text-[#F5F5F5] hover:bg-[#151922]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Academic Card Trigger Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenAcademicModal}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#151922] border border-[#343946] hover:border-[#FF9F43]/40 text-[#F5F5F5] text-xs transition-all group cursor-pointer"
            title="Editar credenciales académicas"
          >
            <div className="w-6 h-6 rounded-md bg-[#0B0D12] border border-[#343946] flex items-center justify-center text-[#FF9F43]">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-left leading-tight">
              <span className="text-[10px] text-[#FF9F43] font-mono block">
                {academicData.studentName}
              </span>
              <span className="text-[9px] text-[#B8BEC9] block truncate max-w-[120px]">
                {academicData.studentId}
              </span>
            </div>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAcademicModal}
            className="p-2 rounded-lg bg-[#151922] border border-[#343946] text-[#FF9F43]"
            aria-label="Datos Académicos"
          >
            <UserCheck className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#151922] border border-[#343946] text-[#B8BEC9] hover:text-[#F5F5F5]"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-[#0B0D12] border-b border-[#343946] space-y-1">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="w-full text-left px-3 py-2 text-sm font-medium text-[#B8BEC9] hover:text-[#FF9F43] hover:bg-[#151922] rounded-md transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#343946]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAcademicModal();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-[#FF9F43] bg-[#151922] rounded-md border border-[#343946]"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Editar Datos ({academicData.studentName})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
