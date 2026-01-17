
import React from 'react';
import { CVData, ColorTheme, TemplateType } from '../types';

interface Props {
  data: CVData;
  profileImage?: string;
}

export const EuropassTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, professionalSummary, workExperiences, educations, skills, languages, certifications, achievements, template } = data;

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="flex items-center mt-6 mb-3">
      <h3 className="font-bold text-[13px] text-gray-800 whitespace-nowrap">{title}</h3>
      <div className="ml-2 flex-grow h-[1.5px] bg-gray-600"></div>
    </div>
  );

  // Official layout rendering
  return (
    <div className="bg-white p-[25mm] shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-[#333] font-['Roboto', sans-serif]" id="cv-preview">
      {/* Header Bar */}
      <div className="bg-gray-50 border-b border-gray-200 p-8 -mx-[25mm] -mt-[25mm] mb-10">
        <h1 className="text-3xl font-bold text-gray-700 mb-4 tracking-tight">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-700 font-medium">
          {personalInfo.nationality && <span><span className="font-bold">Nationality:</span> {personalInfo.nationality}</span>}
          <span className="text-gray-300">|</span>
          {personalInfo.phone && <span><span className="font-bold">Phone:</span> {personalInfo.phone}</span>}
          <span className="text-gray-300">|</span>
          {personalInfo.email && <span><span className="font-bold">Email address:</span> <a href={`mailto:${personalInfo.email}`} className="text-blue-600 underline">{personalInfo.email}</a></span>}
          <span className="text-gray-300">|</span>
          {personalInfo.address && <span><span className="font-bold">Address:</span> {personalInfo.address}, {personalInfo.city}, {personalInfo.country}</span>}
        </div>
      </div>

      {/* About Me */}
      {professionalSummary && (
        <section>
          <SectionTitle title="About myself" />
          <p className="text-[12px] leading-[1.6] text-gray-700 text-justify">
            {professionalSummary}
          </p>
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <section>
          <SectionTitle title="Education & Training" />
          {educations.map((edu) => (
            <div key={edu.id} className="mb-4">
              <p className="text-[12px]">
                <span className="font-bold">{edu.degree}</span> | <span className="text-gray-700">{edu.institution} – {edu.country}</span> | <span className="text-gray-600">{edu.startDate} - {edu.endDate}</span>
              </p>
              {edu.description && <p className="text-[11px] text-gray-500 mt-1">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Work Experience */}
      {workExperiences.length > 0 && (
        <section>
          <SectionTitle title="Work experience" />
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-6">
              <p className="text-[12px] mb-1">
                <span className="font-bold">{exp.jobTitle}</span> | <span className="text-gray-700">{exp.employer}</span> | <span className="text-gray-600">{exp.startDate} - {exp.current ? 'Current' : exp.endDate}</span> | <span className="text-gray-600">{exp.city}, {exp.country}</span>
              </p>
              <div className="text-[11px] text-gray-700 leading-[1.6] pl-4">
                {exp.description.split('\n').map((line, i) => (
                  <div key={i} className="flex items-start mb-0.5">
                    <span className="mr-2 text-gray-400">•</span>
                    <span>{line.replace(/^•\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section>
          <SectionTitle title="Certifications" />
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-3">
              <p className="text-[12px]">
                <span className="font-bold">{cert.title}</span> | {cert.organization} | {cert.date}
              </p>
              {cert.link && <a href={cert.link} className="text-[11px] text-blue-600 underline block mt-0.5">{cert.link}</a>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <SectionTitle title="Skills" />
          <p className="text-[12px] text-gray-700 leading-[1.8]">
            {skills.map((s, i) => (
              <React.Fragment key={s.id}>
                <span className="font-medium">{s.name}</span>
                {i < skills.length - 1 && <span className="text-gray-400 mx-2">|</span>}
              </React.Fragment>
            ))}
          </p>
        </section>
      )}

      {/* Languages Skills */}
      {languages.length > 0 && (
        <section>
          <SectionTitle title="Language Skills" />
          {languages.filter(l => l.motherTongue).map(l => (
            <p key={l.name} className="text-[12px] mb-4"><span className="text-gray-500">Mother tongue(s):</span> <span className="font-bold uppercase">{l.name}</span></p>
          ))}
          
          {languages.filter(l => !l.motherTongue).map(l => (
            <div key={l.name} className="mt-4">
               <div className="flex items-center mb-2">
                 <span className="text-[13px] font-bold text-gray-800 mr-4">{l.name}:</span>
                 <span className="text-[12px] font-bold text-gray-600 border border-gray-300 px-2 py-0.5 bg-gray-50">{l.listening}-{l.writing}</span>
               </div>
               
               <table className="w-full border-collapse text-[10px] text-center border border-gray-200">
                 <thead className="bg-gray-50">
                    <tr>
                      <th colSpan={2} className="border border-gray-200 py-1.5 font-bold uppercase tracking-tight">Understanding</th>
                      <th colSpan={2} className="border border-gray-200 py-1.5 font-bold uppercase tracking-tight">Speaking</th>
                      <th className="border border-gray-200 py-1.5 font-bold uppercase tracking-tight">Writing</th>
                    </tr>
                    <tr className="text-[9px] text-gray-500 font-medium">
                      <th className="border border-gray-200 py-1">Listening</th>
                      <th className="border border-gray-200 py-1">Reading</th>
                      <th className="border border-gray-200 py-1">Spoken production</th>
                      <th className="border border-gray-200 py-1">Spoken interaction</th>
                      <th className="border border-gray-200 py-1"></th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr>
                      <td className="border border-gray-200 py-2 font-bold">{l.listening}</td>
                      <td className="border border-gray-200 py-2 font-bold">{l.reading}</td>
                      <td className="border border-gray-200 py-2 font-bold">{l.spokenProduction}</td>
                      <td className="border border-gray-200 py-2 font-bold">{l.spokenInteraction}</td>
                      <td className="border border-gray-200 py-2 font-bold">{l.writing}</td>
                    </tr>
                 </tbody>
               </table>
            </div>
          ))}
        </section>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <section>
          <SectionTitle title="Achievements" />
          <ul className="list-none p-0">
            {achievements.map((item, i) => (
              <li key={i} className="text-[12px] mb-2 font-bold text-gray-800">• {item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer Branding */}
      <div className="fixed bottom-10 right-10 flex items-center bg-blue-900 px-2 py-1 rounded-sm shadow-sm">
         <span className="text-white font-bold text-[10px] uppercase tracking-tighter flex items-center">
           <svg className="w-3 h-3 mr-1 fill-yellow-400" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
           europass
         </span>
      </div>

      <style>{`
        @media print {
          #cv-preview {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 20mm !important;
          }
          .bg-gray-50 { background-color: #f9fafb !important; -webkit-print-color-adjust: exact; }
          .bg-blue-900 { background-color: #1e3a8a !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};
