// Simple email verification utilities
// In production, you'd want to use a proper email verification service

export function isRealEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  // List of known legitimate email domains
  const legitimateDomains = [
    // Major providers
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'icloud.com', 'protonmail.com', 'zoho.com', 'yandex.com',
    
    // Business domains (common patterns)
    'company.com', 'business.com', 'corp.com', 'inc.com', 'llc.com',
    
    // Educational
    'edu', 'ac.uk', 'edu.au', 'edu.ca',
    
    // Government
    'gov', 'gov.uk', 'gov.au', 'gov.ca'
  ];
  
  // Check if it's a legitimate domain
  const isLegitimate = legitimateDomains.some(legitDomain => 
    domain === legitDomain || domain.endsWith('.' + legitDomain)
  );
  
  // Check if it's a business domain (has proper TLD)
  const hasValidTLD = /\.(com|org|net|edu|gov|co|io|me|us|uk|ca|au|de|fr|jp|cn)$/.test(domain);
  
  return isLegitimate || hasValidTLD;
}

export function isFakeEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;
  
  const fakeDomains = [
    // Temporary email services
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'yopmail.com',
    'tempmail.org', 'throwaway.email', 'temp-mail.org', 'sharklasers.com',
    
    // Test/fake domains
    'example.com', 'test.com', 'fake.com', 'dummy.com', 'temp.com',
    'throwaway.com', 'spam.com', 'trash.com', 'junk.com',
    
    // Disposable email services
    'maildrop.cc', 'getnada.com', 'mailnesia.com', 'mohmal.com',
    'mailcatch.com', 'spamgourmet.com', 'trashmail.com'
  ];
  
  return fakeDomains.includes(domain);
}

export function validateEmailForCSVUpload(email: string): { valid: boolean; error?: string } {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address format' };
  }
  
  // Check for fake domains
  if (isFakeEmailDomain(email)) {
    return { 
      valid: false, 
      error: 'Please use a real email address from a legitimate domain. Temporary or fake email services are not allowed.' 
    };
  }
  
  // Check for legitimate domains (basic verification)
  if (!isRealEmailDomain(email)) {
    return { 
      valid: false, 
      error: 'Please use an email address from a legitimate domain (Gmail, Yahoo, business email, etc.)' 
    };
  }
  
  return { valid: true };
}
