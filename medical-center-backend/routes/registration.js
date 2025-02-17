const express = require('express');
const router = express.Router();
const firebaseAdmin = require('firebase-admin');

// Registration route
router.post('/', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ msg: 'All fields are required.' });
  }

  try {
    // Save user to Firebase Authentication
    const userRecord = await firebaseAdmin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    // Save user details to Firestore
    const firestore = firebaseAdmin.firestore();
    await firestore.collection('users').doc(userRecord.uid).set({
      name,
      email,
      createdAt: new Date(),
    });

    res.status(201).json({ msg: 'User registered successfully', uid: userRecord.uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error registering user', error: err.message });
  }
});

module.exports = router;
