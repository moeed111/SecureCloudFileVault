const User = require('../models/User');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Generate MFA secret and QR code
exports.generateMfa = async (req, res) => {
  const secret = speakeasy.generateSecret({ name: `SecureCloudVault (${req.user.email})` });
  await User.findByIdAndUpdate(req.user.id, { mfaSecret: secret.base32 });
  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) return res.status(500).json({ msg: 'QR code error' });
    res.json({ qr: data_url, secret: secret.base32 });
  });
};

// Verify MFA code and enable MFA
exports.verifyMfa = async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user.id);
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token,
  });
  if (!verified) return res.status(400).json({ msg: 'Invalid MFA code' });
  user.mfaEnabled = true;
  await user.save();
  res.json({ msg: 'MFA enabled' });
};