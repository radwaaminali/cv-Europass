
import React, { useState } from 'react';
import { CVData, PersonalInfo, WorkExperience, Education, Skill, ColorTheme, TemplateType, Language, Certification } from './types';
import { extractCVData } from './services/geminiService';
import { EuropassTemplate } from './components/EuropassTemplate';
import { EuropassLogo } from './components/EuropassLogo';

const mahmoudData: CVData = {
  personalInfo: {
    firstName: 'Mahmoud Salah Afify Mohamed',
    lastName: 'Sayed Ahmed',
    jobTitle: 'Certified Sports Coach & Rehabilitation Specialist',
    email: 'm27moudsala7@gmail.com',
    phone: '(+20) 01032656840',
    address: 'Cairo, Egypt, 11561',
    city: 'Cairo',
    country: 'Egypt',
    postalCode: '11561',
    nationality: 'Egyptian',
  },
  professionalSummary: 'Dedicated and certified Sports Coach with 4+ years of diverse experience across personal training, functional fitness, youth sports coaching (Laser Run), and kinetic rehabilitation for children with special needs.',
  workExperiences: [
    { id: '1', jobTitle: 'Kinetic Rehabilitation Specialist', employer: 'Al-Hamd Physical Therapy Center', city: 'Cairo', country: 'Egypt', startDate: '01/11/2025', endDate: '', current: true, description: 'Design and deliver individualized kinetic rehabilitation programs for children with special needs.\nAssess motor function and implement movement-based interventions.' },
  ],
  educations: [
    { id: '1', degree: 'Bachelor of Sports Science', institution: 'Faculty of Sports Science, Benha University', city: 'Benha', country: 'Egypt', startDate: '01/09/2021', endDate: '01/07/2025', current: false, description: 'Level in EQF: 6' }
  ],
  skills: [
    { id: '1', name: 'Team Leadership', level: 'Expert' },
    { id: '2', name: 'First Aid', level: 'Expert' },
  ],
  languages: [
    { id: '1', name: 'Arabic', motherTongue: true, listening: 'C2', reading: 'C2', writing: 'C2', spokenProduction: 'C2', spokenInteraction: 'C2' },
    { id: '2', name: 'English', motherTongue: false, listening: 'B2', reading: 'B2', writing: 'B2', spokenProduction: 'B2', spokenInteraction: 'B2' }
  ],
  certifications: [
    { id: '1', title: 'Sports Nutrition Workshop', organization: 'Sports Nutrition Club', date: '10/01/2026' }
  ],
  achievements: [
    '1st Place, City Club Laser Run Championship (Under 11) – 2024'
  ],
  template: 'Official',
  colorTheme: 'blue',
};

const App: React.FC = () => {
  const [cvData, setCvData] = useState<CVData>(mahmoudData);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [view, setView] = useState<'upload' | 'editor'>('upload');
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'others'>('personal');

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
          setCvData({ ...data, template: 'Official', colorTheme: 'blue' });
          setView('editor');
        } catch (error) {
          console.error(error);
          alert("Error processing file.");
        }
      }
      setIsExtracting(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('cv-preview');
    if (!element) return;
    setIsGeneratingPDF(true);
    // @ts-ignore
    const html2pdfLib = window.html2pdf;
    const opt = {
      margin: 0,
      filename: `Europass_CV_${cvData.personalInfo.firstName}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try { await html2pdfLib().set(opt).from(element).save(); } catch (err) { console.error(err); } finally { setIsGeneratingPDF(false); }
  };

  const addItem = (listName: keyof CVData, emptyItem: any) => {
    setCvData(prev => ({ ...prev, [listName]: [...(prev[listName] as any[]), { ...emptyItem, id: Date.now().toString() }] }));
  };

  const removeItem = (listName: keyof CVData, id: string) => {
    setCvData(prev => ({ ...prev, [listName]: (prev[listName] as any[]).filter(item => item.id !== id) }));
  };

  const updateListItem = (listName: keyof CVData, id: string, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      [listName]: (prev[listName] as any[]).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  if (view === 'upload') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="max-w-3xl w-full text-center space-y-12">
          <EuropassLogo className="h-20 mb-6 mx-auto" />
          <h1 className="text-6xl font-black text-blue-900 tracking-tighter">
            Europass <span className="text-blue-600">AI</span> Studio
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-12 rounded-[40px] shadow-2xl border hover:scale-[1.02] transition-all cursor-pointer group">
              <label className="block w-full cursor-pointer">
                <input type="file" className="hidden" accept="application/pdf,image/*" onChange={handleFileUpload} disabled={isExtracting} />
                <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-blue-600 transition-all">
                  <i className="fa-solid fa-cloud-arrow-up text-4xl text-blue-600 group-hover:text-white"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Upload Resume</h3>
                <span className="block py-5 rounded-2xl font-black text-lg bg-blue-600 text-white mt-8">
                   {isExtracting ? 'Analyzing...' : 'Analyze Document'}
                </span>
              </label>
            </div>
            <div onClick={() => setView('editor')} className="bg-white p-12 rounded-[40px] shadow-2xl border hover:scale-[1.02] transition-all cursor-pointer group">
              <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-emerald-600 transition-all">
                <i className="fa-solid fa-pen-nib text-4xl text-emerald-600 group-hover:text-white"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Manual Edit</h3>
              <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg mt-8">
                Start Building
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col no-print">
      <nav className="bg-white border-b px-10 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <EuropassLogo className="h-10" />
        <div className="flex items-center space-x-4">
           <button onClick={() => setView('upload')} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all">Exit</button>
           <button 
             onClick={handleDownloadPDF} 
             disabled={isGeneratingPDF}
             className="bg-blue-600 text-white px-10 py-3.5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-blue-700 shadow-xl disabled:opacity-50 flex items-center active:scale-95 transition-all"
           >
              {isGeneratingPDF ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-file-pdf mr-2"></i>}
              DOWNLOAD HIGH-QUALITY PDF
           </button>
        </div>
      </nav>

      <div className="flex-grow flex h-[calc(100vh-85px)] overflow-hidden">
        <aside className="w-[450px] bg-white border-r flex flex-col">
          <div className="flex overflow-x-auto bg-slate-50 border-b custom-scrollbar">
            {[
              { id: 'personal', icon: 'fa-user' },
              { id: 'experience', icon: 'fa-briefcase' },
              { id: 'education', icon: 'fa-graduation-cap' },
              { id: 'skills', icon: 'fa-tools' },
              { id: 'languages', icon: 'fa-language' },
              { id: 'others', icon: 'fa-ellipsis' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 p-4 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <i className={`fa-solid ${tab.icon} block text-lg mb-1`}></i>
                {tab.id}
              </button>
            ))}
          </div>

          <div className="flex-grow overflow-y-auto p-8 custom-scrollbar space-y-8">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-800 border-l-4 border-blue-600 pl-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">First Name</label>
                    <input value={cvData.personalInfo.firstName} onChange={e => setCvData({...cvData, personalInfo: {...cvData.personalInfo, firstName: e.target.value}})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-400 transition-all text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Name</label>
                    <input value={cvData.personalInfo.lastName} onChange={e => setCvData({...cvData, personalInfo: {...cvData.personalInfo, lastName: e.target.value}})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-400 transition-all text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Title / Profession</label>
                  <input value={cvData.personalInfo.jobTitle || ''} onChange={e => setCvData({...cvData, personalInfo: {...cvData.personalInfo, jobTitle: e.target.value}})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-400 transition-all text-sm" placeholder="e.g. Senior Software Engineer" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input value={cvData.personalInfo.email} onChange={e => setCvData({...cvData, personalInfo: {...cvData.personalInfo, email: e.target.value}})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-400 transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                  <input value={cvData.personalInfo.phone} onChange={e => setCvData({...cvData, personalInfo: {...cvData.personalInfo, phone: e.target.value}})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-400 transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professional Summary</label>
                  <textarea value={cvData.professionalSummary} onChange={e => setCvData({...cvData, professionalSummary: e.target.value})} className="w-full h-32 p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-400 transition-all text-sm resize-none" />
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-800 border-l-4 border-blue-600 pl-4">Work Experience</h3>
                  <button onClick={() => addItem('workExperiences', { jobTitle: '', employer: '', city: '', country: '', startDate: '', endDate: '', current: false, description: '' })} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
                {cvData.workExperiences.map(exp => (
                  <div key={exp.id} className="p-6 border rounded-2xl bg-slate-50 relative group transition-all hover:border-blue-200">
                    <button onClick={() => removeItem('workExperiences', exp.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg flex items-center justify-center">
                      <i className="fa-solid fa-times text-xs"></i>
                    </button>
                    <div className="space-y-4">
                      <input placeholder="Job Title" value={exp.jobTitle} onChange={e => updateListItem('workExperiences', exp.id, 'jobTitle', e.target.value)} className="w-full p-2 bg-white border rounded-lg text-sm font-bold" />
                      <input placeholder="Employer" value={exp.employer} onChange={e => updateListItem('workExperiences', exp.id, 'employer', e.target.value)} className="w-full p-2 bg-white border rounded-lg text-sm" />
                      <div className="grid grid-cols-2 gap-2">
                        <input placeholder="Start Date" value={exp.startDate} onChange={e => updateListItem('workExperiences', exp.id, 'startDate', e.target.value)} className="w-full p-2 bg-white border rounded-lg text-xs" />
                        <input placeholder="End Date" value={exp.endDate} onChange={e => updateListItem('workExperiences', exp.id, 'endDate', e.target.value)} className="w-full p-2 bg-white border rounded-lg text-xs" />
                      </div>
                      <textarea placeholder="Description" value={exp.description} onChange={e => updateListItem('workExperiences', exp.id, 'description', e.target.value)} className="w-full h-24 p-2 bg-white border rounded-lg text-xs resize-none" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-800 border-l-4 border-blue-600 pl-4">Education</h3>
                  <button onClick={() => addItem('educations', { degree: '', institution: '', city: '', country: '', startDate: '', endDate: '', current: false, description: '' })} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
                {cvData.educations.map(edu => (
                  <div key={edu.id} className="p-6 border rounded-2xl bg-slate-50 relative group transition-all hover:border-blue-200">
                    <button onClick={() => removeItem('educations', edu.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg flex items-center justify-center">
                      <i className="fa-solid fa-times text-xs"></i>
                    </button>
                    <div className="space-y-4">
                      <input placeholder="Degree" value={edu.degree} onChange={e => updateListItem('educations', edu.id, 'degree', e.target.value)} className="w-full p-2 bg-white border rounded-lg text-sm font-bold" />
                      <input placeholder="Institution" value={edu.institution} onChange={e => updateListItem('educations', edu.id, 'institution', e.target.value)} className="w-full p-2 bg-white border rounded-lg text-sm" />
                      <div className="grid grid-cols-2 gap-2">
                        <input placeholder="Start Date" value={edu.startDate} onChange={e => updateListItem('educations', edu.id, 'startDate', e.target.value)} className="w-full p-2 bg-white border rounded-lg text-xs" />
                        <input placeholder="End Date" value={edu.endDate} onChange={e => updateListItem('educations', edu.id, 'endDate', e.target.value)} className="w-full p-2 bg-white border rounded-lg text-xs" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-800 border-l-4 border-blue-600 pl-4">Skills</h3>
                  <button onClick={() => addItem('skills', { name: '', level: 'Intermediate' })} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {cvData.skills.map(skill => (
                    <div key={skill.id} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border group">
                       <input value={skill.name} onChange={e => updateListItem('skills', skill.id, 'name', e.target.value)} className="flex-grow bg-transparent p-1 text-sm font-bold outline-none" placeholder="Skill Name" />
                       <select value={skill.level} onChange={e => updateListItem('skills', skill.id, 'level', e.target.value)} className="bg-white text-xs border rounded p-1">
                          {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(l => <option key={l} value={l}>{l}</option>)}
                       </select>
                       <button onClick={() => removeItem('skills', skill.id)} className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-all">
                          <i className="fa-solid fa-trash-can"></i>
                       </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'languages' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-800 border-l-4 border-blue-600 pl-4">Languages</h3>
                  <button onClick={() => addItem('languages', { name: '', motherTongue: false, listening: 'B2', reading: 'B2', writing: 'B2', spokenProduction: 'B2', spokenInteraction: 'B2' })} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
                {cvData.languages.map(lang => (
                  <div key={lang.id} className="p-4 border rounded-2xl bg-slate-50 space-y-3">
                    <div className="flex justify-between items-center">
                      <input value={lang.name} onChange={e => updateListItem('languages', lang.id, 'name', e.target.value)} className="bg-transparent font-black text-slate-800 outline-none" placeholder="Language Name" />
                      <div className="flex items-center space-x-2">
                        <label className="text-[10px] font-bold text-slate-400">Mother Tongue?</label>
                        <input type="checkbox" checked={lang.motherTongue} onChange={e => updateListItem('languages', lang.id, 'motherTongue', e.target.checked)} className="w-4 h-4 rounded" />
                      </div>
                    </div>
                    {!lang.motherTongue && (
                      <div className="grid grid-cols-2 gap-2">
                        {['listening', 'reading', 'writing', 'spokenProduction', 'spokenInteraction'].map(field => (
                          <div key={field} className="space-y-1">
                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{field.replace(/([A-Z])/g, ' $1')}</label>
                            <select value={(lang as any)[field]} onChange={e => updateListItem('languages', lang.id, field, e.target.value)} className="w-full text-[10px] p-1 border rounded bg-white font-bold">
                              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => removeItem('languages', lang.id)} className="w-full text-xs text-red-500 font-bold hover:text-red-700 pt-2 border-t mt-2">Remove Language</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'others' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-slate-800 border-l-4 border-blue-600 pl-4">Certifications</h3>
                    <button onClick={() => addItem('certifications', { title: '', organization: '', date: '', link: '' })} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  {cvData.certifications.map(cert => (
                    <div key={cert.id} className="p-4 border rounded-xl bg-slate-50 space-y-2 relative group">
                      <button onClick={() => removeItem('certifications', cert.id)} className="absolute -top-2 -right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-all"><i className="fa-solid fa-circle-xmark"></i></button>
                      <input placeholder="Cert Title" value={cert.title} onChange={e => updateListItem('certifications', cert.id, 'title', e.target.value)} className="w-full p-2 bg-white border rounded text-xs font-bold" />
                      <input placeholder="Organization" value={cert.organization} onChange={e => updateListItem('certifications', cert.id, 'organization', e.target.value)} className="w-full p-2 bg-white border rounded text-xs" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-800 border-l-4 border-blue-600 pl-4">Achievements</h3>
                  <textarea 
                    value={cvData.achievements.join('\n')} 
                    onChange={e => setCvData({...cvData, achievements: e.target.value.split('\n')})} 
                    className="w-full h-32 p-4 bg-slate-50 border rounded-2xl outline-none resize-none text-xs" 
                    placeholder="Enter one achievement per line..."
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-grow bg-slate-200 p-12 overflow-y-auto flex justify-center items-start custom-scrollbar">
          <div className="transform scale-[0.85] origin-top shadow-2xl transition-all duration-500 hover:scale-[0.90]">
             <EuropassTemplate data={cvData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
