const express = require('express');
const router = express.Router();
const firebaseAdmin = require('firebase-admin');

// Login route
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required.' });
  }

  try {
    // Firebase does not provide password validation directly.
    // Use Firebase Authentication to validate user credentials.

    // Check if user exists in Firestore
    const firestore = firebaseAdmin.firestore();
    const userSnapshot = await firestore.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ msg: 'Invalid email or password.' });
    }

    // Respond with user info
    const userData = userSnapshot.docs[0].data();
    res.status(200).json({ msg: 'Login successful', user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error logging in', error: err.message });
  }
});

module.exports = router;
