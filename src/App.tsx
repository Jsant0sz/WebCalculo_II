/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AcademicData } from './types';
import { initialAcademicData } from './data/courseData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TheorySection } from './components/TheorySection';
import { GraphLab } from './components/GraphLab';
import { VideosSection } from './components/VideosSection';
import { SolvedProblemsSection } from './components/SolvedProblemsSection';
import { PracticeSection } from './components/PracticeSection';
import { AcademicDataModal } from './components/AcademicDataModal';
import { Footer } from './components/Footer';

export default function App() {
  // Load academic data from localStorage if available
  const [academicData, setAcademicData] = useState<AcademicData>(() => {
    try {
      const stored = localStorage.getItem('umg_academic_data');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return initialAcademicData;
  });

  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  // Save to localStorage whenever academic data updates
  const handleUpdateAcademicData = (newData: AcademicData) => {
    setAcademicData(newData);
    try {
      localStorage.setItem('umg_academic_data', JSON.stringify(newData));
    } catch {
      // ignore
    }
  };

  // Scroll spy to update active section in navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'aprende', 'laboratorio', 'videos', 'problemas', 'practica'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F5F5F5] flex flex-col selection:bg-[#FF9F43]/30 selection:text-[#FFC078]">
      {/* Futuristic Fixed Navbar */}
      <Navbar
        academicData={academicData}
        onOpenAcademicModal={() => setIsAcademicModalOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Continuous Single-Page Content */}
      <main className="flex-1">
        {/* 1. INICIO: Portada, Datos Académicos Editables, Gráfica con Área Sombreada */}
        <HeroSection
          academicData={academicData}
          onUpdateAcademicData={handleUpdateAcademicData}
          onOpenModal={() => setIsAcademicModalOpen(true)}
        />

        {/* 2. APRENDE: Teoría, Intersecciones, Superior/Inferior, Procedimiento Paso a Paso, Simulador de Riemann */}
        <TheorySection />

        {/* HERRAMIENTA INTERACTIVA: Laboratorio Gráfico Cartesiano */}
        <GraphLab />

        {/* 3. VIDEOS: Exactamente tres tarjetas atractivas para insertar videos de máx 1 min, miniatura, título y botón funcional */}
        <VideosSection />

        {/* 4. PROBLEMAS RESUELTOS: 3 ejercicios diferentes con procedimiento oculto inicialmente y botón "Mostrar solución" */}
        <SolvedProblemsSection />

        {/* 5. PRACTICA: 5 ejercicios de dificultad creciente con comprobación de respuestas y procedimiento revelable */}
        <PracticeSection />
      </main>

      {/* Futuristic Footer */}
      <Footer
        academicData={academicData}
        onOpenAcademicModal={() => setIsAcademicModalOpen(true)}
      />

      {/* Academic Credentials Full Modal Form */}
      <AcademicDataModal
        isOpen={isAcademicModalOpen}
        onClose={() => setIsAcademicModalOpen(false)}
        academicData={academicData}
        onSave={handleUpdateAcademicData}
      />
    </div>
  );
}
