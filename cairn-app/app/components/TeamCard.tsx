// app/components/TeamCard.tsx
import { project } from "~/data/project";

export function TeamCard() {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-line dark:border-dark-border p-6 shadow-sm transition-colors duration-200">
      <h3 className="text-lg font-semibold text-ink-700 dark:text-dark-text font-heading mb-6 transition-colors duration-200">Team</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {project.team.map((member, idx) => (
          <div key={idx} className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-ink-100 dark:bg-dark-border flex items-center justify-center overflow-hidden transition-colors duration-200">
              {member.photoUrl ? (
                <img 
                  src={member.photoUrl} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-2xl font-semibold text-ink-400 dark:text-dark-text-muted transition-colors duration-200">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            
            <div className="text-sm font-semibold text-ink-700 dark:text-dark-text transition-colors duration-200">{member.name}</div>
            <div className="text-xs text-ink-500 dark:text-dark-text-muted mb-3 transition-colors duration-200">{member.role}</div>
            
            {member.contacts && (
              <div className="flex justify-center gap-2">
                {member.contacts.x && (
                  <a 
                    href={member.contacts.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 rounded hover:bg-ink-100 dark:hover:bg-dark-border flex items-center justify-center transition-colors duration-200"
                    title="X (Twitter)"
                  >
                    <svg className="w-4 h-4 text-ink-400 dark:text-dark-text-muted transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                
                {member.contacts.email && (
                  <a 
                    href={`mailto:${member.contacts.email}`}
                    className="w-6 h-6 rounded hover:bg-ink-100 dark:hover:bg-dark-border flex items-center justify-center transition-colors duration-200"
                    title="Email"
                  >
                    <svg className="w-4 h-4 text-ink-400 dark:text-dark-text-muted transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                )}
                
                {member.contacts.site && (
                  <a 
                    href={member.contacts.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 rounded hover:bg-ink-100 dark:hover:bg-dark-border flex items-center justify-center transition-colors duration-200"
                    title="Website"
                  >
                    <svg className="w-4 h-4 text-ink-400 dark:text-dark-text-muted transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
