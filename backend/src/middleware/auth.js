import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

export function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieSecure = String(process.env.COOKIE_SECURE || (isProd ? 'true' : 'false')) === 'true';
  const sameSite = process.env.COOKIE_SAMESITE || (isProd ? 'none' : 'lax');
  const domain = process.env.COOKIE_DOMAIN || undefined;
  res.cookie('token', token, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite,
    domain,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}


