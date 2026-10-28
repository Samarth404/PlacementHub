export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '******';
  const [user, domain] = email.split('@');
  if (user.length <= 2) {
    return `${user[0]}*@${domain}`;
  }
  return `${user.slice(0, 2)}${'*'.repeat(Math.max(3, user.length - 2))}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return '******';
  const clean = phone.trim();
  if (clean.length < 6) return '******';
  const start = clean.slice(0, 3);
  const end = clean.slice(-2);
  return `${start}******${end}`;
}

export function maskUSN(usn: string): string {
  if (!usn) return '******';
  if (usn.length <= 4) return `${usn[0]}**${usn.slice(-1)}`;
  return `${usn.slice(0, 4)}***${usn.slice(-2)}`;
}
