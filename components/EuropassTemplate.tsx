
import React from 'react';
import { CVData } from '../types';

interface Props {
  data: CVData;
  profileImage?: string;
}

export const EuropassTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, professionalSummary, workExperiences, educations, skills, languages, certifications, achievements } = data;

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="flex items-center mt-8 mb-4">
      <h3 className="font-bold text-[14px] text-gray-800 whitespace-nowrap">{title}</h3>
      <div className="ml-3 flex-grow h-[1px] bg-gray-400"></div>
    </div>
  );

  return (
    <div 
      className="bg-white p-[20mm] mx-auto w-[210mm] min-h-[297mm] text-[#333] relative shadow-xl" 
      id="cv-preview"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div className="bg-[#f8f9fa] p-8 -mx-[20mm] -mt-[20mm] mb-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-700 mb-1 tracking-tight">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-lg font-semibold text-blue-700 mb-4 opacity-80 italic">
            {personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-700 font-medium items-center">
          {personalInfo.nationality && <span><span className="font-bold">Nationality:</span> {personalInfo.nationality}</span>}
          <span className="text-gray-300">|</span>
          {personalInfo.phone && <span><span className="font-bold">Phone:</span> {personalInfo.phone}</span>}
          <span className="text-gray-300">|</span>
          {personalInfo.email && (
            <span>
              <span className="font-bold">Email address:</span>{' '}
              <span className="text-blue-600 underline">{personalInfo.email}</span>
            </span>
          )}
          <span className="text-gray-300">|</span>
          {personalInfo.address && (
            <span>
              <span className="font-bold">Address:</span> {personalInfo.address}, {personalInfo.city}, {personalInfo.country}
            </span>
          )}
        </div>
      </div>

      {/* About */}
      {professionalSummary && (
        <section>
          <SectionTitle title="About myself" />
          <p className="text-[12px] leading-[1.7] text-gray-700 text-justify">
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
                <span className="font-bold">{edu.degree}</span> | <span className="text-gray-700">{edu.institution}</span> | <span className="text-gray-500">{edu.startDate} - {edu.endDate}</span>
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {workExperiences.length > 0 && (
        <section>
          <SectionTitle title="Work experience" />
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-6">
              <p className="text-[12px] mb-2">
                <span className="font-bold">{exp.jobTitle}</span> | <span className="text-gray-700">{exp.employer}</span> | <span className="text-gray-500">{exp.startDate} - {exp.current ? 'Current' : exp.endDate}</span> | <span className="text-gray-500">{exp.city}, {exp.country}</span>
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
              {cert.link && <span className="text-[10px] text-blue-600 underline block mt-0.5">{cert.link}</span>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <SectionTitle title="Skills" />
          <p className="text-[12px] text-gray-700 leading-[2]">
            {skills.map((s, i) => (
              <React.Fragment key={s.id}>
                <span className="font-medium">{s.name}</span>
                {i < skills.length - 1 && <span className="text-gray-300 mx-3">|</span>}
              </React.Fragment>
            ))}
          </p>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section>
          <SectionTitle title="Language Skills" />
          {languages.filter(l => l.motherTongue).map(l => (
            <p key={l.name} className="text-[12px] mb-5"><span className="text-gray-500">Mother tongue(s):</span> <span className="font-bold uppercase">{l.name}</span></p>
          ))}
          
          {languages.filter(l => !l.motherTongue).map(l => (
            <div key={l.name} className="mt-4">
               <div className="flex items-center mb-3">
                 <span className="text-[13px] font-bold text-gray-800 mr-4">{l.name}:</span>
                 <span className="text-[11px] font-bold text-gray-600 border border-gray-300 px-3 py-1 bg-gray-50 rounded-sm">{l.listening}-{l.writing}</span>
               </div>
               
               <table className="w-full border-collapse text-[10px] text-center border border-gray-300">
                 <thead className="bg-[#f9fafb]">
                    <tr>
                      <th colSpan={2} className="border border-gray-300 py-2 font-bold uppercase text-gray-600">Understanding</th>
                      <th colSpan={2} className="border border-gray-300 py-2 font-bold uppercase text-gray-600">Speaking</th>
                      <th className="border border-gray-300 py-2 font-bold uppercase text-gray-600">Writing</th>
                    </tr>
                    <tr className="text-[9px] text-gray-400">
                      <th className="border border-gray-300 py-1 font-normal">Listening</th>
                      <th className="border border-gray-300 py-1 font-normal">Reading</th>
                      <th className="border border-gray-300 py-1 font-normal">Spoken production</th>
                      <th className="border border-gray-300 py-1 font-normal">Spoken interaction</th>
                      <th className="border border-gray-300 py-1 font-normal"></th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 py-3 font-bold text-[12px]">{l.listening}</td>
                      <td className="border border-gray-300 py-3 font-bold text-[12px]">{l.reading}</td>
                      <td className="border border-gray-300 py-3 font-bold text-[12px]">{l.spokenProduction}</td>
                      <td className="border border-gray-300 py-3 font-bold text-[12px]">{l.spokenInteraction}</td>
                      <td className="border border-gray-300 py-3 font-bold text-[12px]">{l.writing}</td>
                    </tr>
                 </tbody>
               </table>
            </div>
          ))}
        </section>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <section className="mb-10">
          <SectionTitle title="Achievements" />
          <ul className="list-none p-0">
            {achievements.map((item, i) => (
              <li key={i} className="text-[12px] mb-2 font-bold text-gray-800">• {item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Official Europass Logo in Footer */}
      <div className="absolute bottom-[10mm] right-[10mm] flex items-center bg-[#1e3a8a] px-3 py-1.5 rounded-sm">
         <span className="text-white font-bold text-[11px] uppercase tracking-tighter flex items-center">
           <svg className="w-4 h-4 mr-1.5 fill-yellow-400" viewBox="0 0 24 24">
             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
           </svg>
           europass
         </span>
      </div>

      <style>{`
        @media print {
          #cv-preview {
            box-shadow: none !important;
            margin: 0 !important;
            width: 210mm;
            height: 297mm;
          }
          .bg-[#f8f9fa] { background-color: #f8f9fa !important; -webkit-print-color-adjust: exact; }
          .bg-[#1e3a8a] { background-color: #1e3a8a !important; -webkit-print-color-adjust: exact; }
          .bg-[#f9fafb] { background-color: #f9fafb !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};
