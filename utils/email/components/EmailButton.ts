export const StatusBadge = (type: 'success' | 'error' | 'warning' | 'info', message: string, subtitle?: string) => {
  const colors = {
    success: { bg: '#f0fdf4', border: '#10b981', text: '#166534', icon: '✓' },
    error: { bg: '#fef2f2', border: '#ef4444', text: '#dc2626', icon: '✕' },
    warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '⚠' },
    info: { bg: '#f0f9ff', border: '#3b82f6', text: '#1e40af', icon: 'ℹ' }
  };
  
  const style = colors[type];
  
  return `
    <div style="background-color: ${style.bg}; border: 2px solid ${style.border}; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 60px; height: 60px; background-color: ${style.border}; border-radius: 50%; margin-bottom: 15px;">
        <span style="color: white; font-size: 24px; font-weight: bold;">${style.icon}</span>
      </div>
      <h3 style="color: ${style.text}; margin: 0 0 10px 0; font-size: 18px;">
        ${message}
      </h3>
      ${subtitle ? `
        <p style="color: #6b7280; margin: 0; font-size: 14px;">
          ${subtitle}
        </p>
      ` : ''}
    </div>
  `;
};

export const EmailButton = (href: string, label: string, variant: 'primary' | 'secondary' | 'success' | 'warning' = 'primary') => {
  const styles = {
    primary: 'background-color: #4F46E5; color: white',
    secondary: 'background-color: #6b7280; color: white',
    success: 'background-color: #10b981; color: white',
    warning: 'background-color: #f59e0b; color: white'
  };
  
  return `
    <a href="${href}" 
       style="display: inline-block; padding: 15px 35px; ${styles[variant]}; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 5px;">
      ${label}
    </a>
  `;
};

export const AmountDisplay = (amount: string, label: string = "Amount", gradient: boolean = true) => {
  const bgStyle = gradient 
    ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'
    : 'background-color: #4F46E5;';
    
  return `
    <div style="${bgStyle} padding: 25px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
      <p style="color: white; margin: 0 0 10px 0; font-size: 14px; opacity: 0.95;">
        ${label}
      </p>
      <p style="color: white; margin: 0; font-size: 32px; font-weight: bold;">
        ${amount}
      </p>
    </div>
  `;
};
