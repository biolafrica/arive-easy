export const InfoBox = (title: string, content: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') => {
  const colors = {
    info: { bg: '#f0f9ff', border: '#3b82f6', text: '#1e40af' },
    warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    success: { bg: '#f0fdf4', border: '#10b981', text: '#166534' },
    error: { bg: '#fef2f2', border: '#ef4444', text: '#dc2626' }
  };
  
  const style = colors[type];
  
  return `
    <div style="background-color: ${style.bg}; border-left: 4px solid ${style.border}; padding: 15px; margin: 25px 0; border-radius: 4px;">
      <h4 style="color: ${style.text}; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
        ${title}
      </h4>
      <div style="color: ${style.text}; margin: 0; font-size: 14px; line-height: 1.6;">
        ${content}
      </div>
    </div>
  `;
};

export const DataTable = (rows: { label: string; value: string; highlight?: boolean }[], title?: string) => {
  return `
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
      ${title ? `
        <h3 style="color: #374151; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
          ${title}
        </h3>
      ` : ''}
      
      <table style="width: 100%;">
        ${rows.map(row => `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">${row.label}:</td>
            <td style="padding: 8px 0; color: ${row.highlight ? '#10b981' : '#1f2937'}; font-size: 14px; text-align: right; ${row.highlight ? 'font-weight: 600;' : ''} font-family: monospace;">
              ${row.value}
            </td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;
};

export const Timeline = (steps: { title: string; description: string; status: 'completed' | 'current' | 'pending' }[]) => {
  return `
    <div style="margin: 30px 0;">
      <div style="position: relative; padding-left: 30px;">
        ${steps.map(step => {
          const colors = {
            completed: '#10b981',
            current: '#4F46E5', 
            pending: '#e5e7eb'
          };
          
          return `
            <div style="margin-bottom: 25px;">
              <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: ${colors[step.status]}; border-radius: 50%;"></div>
              <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">${step.title}</h4>
              <p style="color: #6b7280; margin: 0; font-size: 14px;">${step.description}</p>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};
