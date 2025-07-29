const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const pool = require('../config/database');
const { promisePool } = require('../config/database');


const signAccess = payload =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_EXPIRES_IN });

const signRefresh = () =>
  crypto.randomBytes(64).toString('hex'); // store raw token

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findByEmail(email)) return res.status(409).json({ msg: 'Email exists' });
    const id = `USR_${Date.now()}`;
    const user = await User.create({ id, name, email, password});

    const accessToken = signAccess({ id: user.id});
    const refreshToken = signRefresh();
   await promisePool.execute(
  'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?,?,DATE_ADD(NOW(),INTERVAL ? DAY))',
  [user.id, refreshToken, parseInt(process.env.REFRESH_EXPIRES_IN) || 7]
);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ accessToken, user });
      
  
    } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({ msg: 'No account found with this email address' });
    }

    // Here you would typically:
    // 1. Generate a reset token
    // 2. Save it to the database with expiration
    // 3. Send email with reset link
    
    // For now, just return success
    res.json({ msg: 'Password reset instructions sent to your email' });
  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !(await User.compare(password, user.password_hash)))
      return res.status(401).json({ msg: 'Invalid credentials' });

    const accessToken = signAccess({ id: user.id });
    const refreshToken = signRefresh();
    
    await promisePool.execute(
  'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?,?,DATE_ADD(NOW(),INTERVAL ? DAY))',
  [user.id, refreshToken, parseInt(process.env.REFRESH_EXPIRES_IN) || 7]
);
   
    // await promisePool.execute(
    //   'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?,?,DATE_ADD(NOW(),INTERVAL ?))',
    //   [user.id, refreshToken, process.env.REFRESH_EXPIRES_IN]
    // );

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ accessToken, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(401);

    const [rows] = await promisePool.execute('SELECT * FROM refresh_tokens WHERE token = ?', [refreshToken]);
    const stored = rows[0];
    if (!stored || new Date(stored.expires_at) < new Date()) return res.sendStatus(403);

    await promisePool.execute('DELETE FROM refresh_tokens WHERE id = ?', [stored.id]); // rotate
    const accessToken = signAccess({ id: stored.user_id });
    const newRefresh = signRefresh();
    await promisePool.execute(
  'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?,?,DATE_ADD(NOW(),INTERVAL ? DAY))',
  [user.id, refreshToken, parseInt(process.env.REFRESH_EXPIRES_IN) || 7]
);
   
    // await promisePool.execute(
    //   'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?,?,DATE_ADD(NOW(),INTERVAL ?))',
    //   [stored.user_id, newRefresh, process.env.REFRESH_EXPIRES_IN]
    // );

    res
      .cookie('refreshToken', newRefresh, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ accessToken });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) await promisePool.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    res.clearCookie('refreshToken').sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    // req.user was put there by authMiddleware after verifying the token
    const [ rows ] = await promisePool.execute(
      'SELECT id, name, email FROM users WHERE id = ?', [req.user.id]
    );
    if (!rows.length) return res.sendStatus(404);
    res.json({ user: rows[0] });
  } catch (err) {
    next(err);
  }
};
