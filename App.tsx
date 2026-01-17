
import React, { useState, useRef } from 'react';
import { CVData, PersonalInfo, WorkExperience, Education, Skill, ColorTheme, TemplateType, Language, Certification } from './types';
import { extractCVData } from './services/geminiService';
import { EuropassTemplate } from './components/EuropassTemplate';
import { EuropassLogo } from './components/EuropassLogo';

const initialData: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    nationality: '',
  },
  professionalSummary: '',
  workExperiences: [],
  educations: [],
  skills: [],
  languages: [],
  certifications: [],
  achievements: [],
  template: 'Official',
  colorTheme: 'blue',
};

const templates: TemplateType[] = ['Official', 'Modern', 'Classic', 'Creative', 'Minimal', 'Professional'];

const App: React.FC = () => {
  const [cvData, setCvData] = useState<CVData>(initialData);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [view, setView] = useState<'upload' | 'editor'>('upload');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result?.toString().split(',')[1];
      if (base64) {
        try {
          const data = await extractCVData(base64, file.type);
          setCvData(prev => ({ 
            ...data, 
            template: prev.template || 'Official', 
            colorTheme: prev.colorTheme || 'blue' 
          }));
          setView('editor');
        } catch (error) {
          console.error("Extraction error:", error);
          alert("Could not extract data. Please ensure it's a valid document.");
        }
      }
      setIsExtracting(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePasteText = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get('cvText') as string;
    if (!text) return;

    setIsExtracting(true);
    try {
      const data = await extractCVData(text);
      setCvData(prev => ({ ...data, template: prev.template, colorTheme: prev.colorTheme }));
      setView('editor');
    } catch (error) {
      console.error("Extraction error:", error);
      alert("AI failed to parse text. Manual mode activated.");
      setView('editor');
    } finally {
      setIsExtracting(false);
    }
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('cv-preview');
    if (!element) {
        alert("CV Preview element not found.");
        return;
    }

    setIsGeneratingPDF(true);
    
    // @ts-ignore
    const html2pdfLib = window.html2pdf;
    
    if (!html2pdfLib) {
        alert("PDF generator library not loaded. Please check your internet connection.");
        setIsGeneratingPDF(false);
        return;
    }

    const opt = {
      margin: 0,
      filename: `Europass_CV_${cvData.personalInfo.firstName || 'User'}_${cvData.personalInfo.lastName || ''}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
        await html2pdfLib().set(opt).from(element).save();
    } catch (error) {
        console.error("PDF Generation error:", error);
        alert("An error occurred while generating the PDF. Please try again.");
    } finally {
        setIsGeneratingPDF(false);
    }
  };

  if (view === 'upload') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-3xl w-full text-center space-y-12">
          <div className="flex flex-col items-center animate-fade-in">
            <EuropassLogo className="h-20 mb-6" />
            <h1 className="text-6xl font-black text-blue-900 tracking-tighter mb-4 leading-tight">
              Europass <span className="text-blue-600">AI</span> Studio
            </h1>
            <p className="text-xl text-slate-600 max-w-xl mx-auto font-medium">Create professional, industry-standard CVs in seconds using next-gen intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100 hover:scale-[1.02] transition-all cursor-pointer group relative flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-all">
                <i className="fa-solid fa-cloud-arrow-up text-4xl text-blue-600 group-hover:text-white"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Upload Resume</h3>
              <p className="text-slate-500 mb-8 text-sm italic">PDF, Image, or Word Parser</p>
              <label className="block w-full">
                <input type="file" className="hidden" accept="application/pdf,image/*" onChange={handleFileUpload} disabled={isExtracting} />
                <span className={`block py-5 rounded-2xl font-black text-lg shadow-xl tracking-tight transition-all text-center ${isExtracting ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 cursor-pointer'}`}>
                   {isExtracting ? 'Analyzing Resume...' : 'Analyze Document'}
                </span>
              </label>
            </div>

            <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100 hover:scale-[1.02] transition-all cursor-pointer group relative flex flex-col items-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-all">
                <i className="fa-solid fa-pen-nib text-4xl text-emerald-600 group-hover:text-white"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Manual Builder</h3>
              <p className="text-slate-500 mb-8 text-sm italic">Build from scratch</p>
              <button onClick={() => setView('editor')} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl tracking-tight transition-all active:scale-95">
                Start Editing
              </button>
            </div>
          </div>

          <form onSubmit={handlePasteText} className="bg-white/60 backdrop-blur-xl p-10 rounded-[40px] border border-white/50 shadow-2xl max-w-2xl mx-auto">
             <textarea 
               name="cvText" 
               className="w-full h-32 p-6 bg-white/50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-sm placeholder:italic"
               placeholder="Paste your resume text here for instant transformation..."
             ></textarea>
             <button type="submit" className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all">
                Extract with AI
             </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 no-print flex flex-col">
      <nav className="bg-white/90 backdrop-blur-xl border-b sticky top-0 z-50 px-10 py-4 flex justify-between items-center shadow-sm">
        <EuropassLogo className="h-10" />
        <div className="flex items-center space-x-4">
           <button onClick={() => setView('upload')} className="px-5 py-2.5 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition-all">Exit</button>
           <button 
             onClick={handleDownloadPDF} 
             disabled={isGeneratingPDF}
             className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
           >
              {isGeneratingPDF ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Generating...
                  </>
              ) : (
                  <>
                    <i className="fa-solid fa-file-pdf mr-2"></i> Download High-Quality PDF
                  </>
              )}
           </button>
        </div>
      </nav>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden h-[calc(100vh-81px)]">
        <aside className="lg:col-span-4 bg-white border-r overflow-y-auto p-10 custom-scrollbar space-y-10">
          <section>
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center tracking-tight">
              <i className="fa-solid fa-wand-magic-sparkles mr-3 text-blue-600"></i>Design Editor
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {templates.map(t => (
                <button 
                  key={t}
                  onClick={() => setCvData(prev => ({ ...prev, template: t }))}
                  className={`py-3 px-1 rounded-xl text-[10px] font-black border uppercase tracking-widest transition-all ${cvData.template === t ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center border-t pt-8 tracking-tight">
              <i className="fa-solid fa-pen-nib mr-3 text-blue-600"></i>Form Content
            </h2>
            
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Personal Info</label>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="First Name" value={cvData.personalInfo.firstName} onChange={(e) => updatePersonalInfo('firstName', e.target.value)} className="p-3 bg-slate-50 border rounded-xl text-sm outline-none font-medium" />
                <input placeholder="Last Name" value={cvData.personalInfo.lastName} onChange={(e) => updatePersonalInfo('lastName', e.target.value)} className="p-3 bg-slate-50 border rounded-xl text-sm outline-none font-medium" />
              </div>
              <input placeholder="Nationality" value={cvData.personalInfo.nationality} onChange={(e) => updatePersonalInfo('nationality', e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl text-sm outline-none font-medium" />
              <input placeholder="Phone" value={cvData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl text-sm outline-none font-medium" />
              <input placeholder="Email" value={cvData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl text-sm outline-none font-medium" />
            </div>

            <div className="space-y-4">
               <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Experience</label>
               {cvData.workExperiences.map(exp => (
                 <div key={exp.id} className="p-4 border rounded-xl bg-slate-50 space-y-2">
                    <input placeholder="Job Title" value={exp.jobTitle} onChange={e => setCvData(prev => ({ ...prev, workExperiences: prev.workExperiences.map(w => w.id === exp.id ? { ...w, jobTitle: e.target.value } : w) }))} className="w-full bg-white p-2 text-xs border rounded font-bold" />
                    <textarea placeholder="Description" value={exp.description} onChange={e => setCvData(prev => ({ ...prev, workExperiences: prev.workExperiences.map(w => w.id === exp.id ? { ...w, description: e.target.value } : w) }))} className="w-full h-20 bg-white p-2 text-xs border rounded resize-none" />
                 </div>
               ))}
            </div>
          </section>
        </aside>

        <main className="lg:col-span-8 bg-slate-200 p-12 overflow-y-auto flex justify-center items-start custom-scrollbar">
          <div className="transform scale-90 lg:scale-100 origin-top shadow-2xl transition-transform duration-300">
             <EuropassTemplate data={cvData} profileImage={profileImage} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
