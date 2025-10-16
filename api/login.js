import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import supabaseAdmin from './_supabase.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '1h';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required' });

    // Admin hardcoded (demo) - still available
    const ADMIN = { username: 'NEadmin', email: 'admin@nusantara.com', password: 'BARA211' };
    const isAdmin = (username === ADMIN.username || username === ADMIN.email) && password === ADMIN.password;
    if (isAdmin) {
      const adminUser = { id: 0, username: ADMIN.username, email: ADMIN.email, role: 'admin', isAdmin: true };
      const token = jwt.sign({ id: adminUser.id, role: adminUser.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      return res.status(200).json({ success: true, message: 'Login admin berhasil', user: adminUser, token });
    }

    // Use Supabase to fetch user
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Supabase not configured' });
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id,username,email,password,role,is_active')
      .or(`username.eq.${username},email.eq.${username}`);
    if (error) {
      console.error('Supabase error (login):', error);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (!users || users.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const user = users[0];
    let isValid = false;
    if (user.password && user.password.startsWith('$2')) {
      isValid = await bcrypt.compare(password, user.password);
    } else {
      isValid = user.password === password;
    }
    if (!isValid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.is_active === false) return res.status(403).json({ success: false, message: 'Account inactive' });

    const userResponse = { id: user.id, username: user.username, email: user.email, role: user.role || 'user', isAdmin: (user.role || 'user') === 'admin' };
    const token = jwt.sign({ id: userResponse.id, role: userResponse.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return res.status(200).json({ success: true, message: 'Login berhasil', user: userResponse, token });
  } catch (err) {
    console.error('Login error (api/login):', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
