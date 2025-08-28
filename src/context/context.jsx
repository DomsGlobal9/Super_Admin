import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
// import { 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   signOut as firebaseSignOut, 
//   onAuthStateChanged,
//   updateProfile
// } from "firebase/auth";
// import { 
//   doc, 
//   getDoc, 
//   setDoc, 
//   collection, 
//   query, 
//   where, 
//   getDocs 
// } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig"; // Import auth from your config

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Product data state (preserved from your original context)
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    productType: 'Ready to Wear',
    chooseType: '',
    dressType: '',
    materialType: '',
    designType: '',
    price: '',
    selectedSizes: ['XS'],
    selectedColors: [],
    units: {
      S: 22,
      M: 22,
      L: 22,
    },
    images: [],
  });

  const updateProductData = (data) => {
    setProductData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, "vendor_registrations", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } else {
          setCurrentUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const clearError = () => setError(null);

  // Check if user exists by email or phone
  const checkUserExists = async (identifier) => {
    try {
      // Check by email first
      const userQuery = query(
        collection(db, 'vendor_registrations'),
        where('email', '==', identifier)
      );
      let querySnapshot = await getDocs(userQuery);
      
      if (!querySnapshot.empty) {
        return { exists: true, method: 'email' };
      }

      // Check by phone if not found by email
      const phoneQuery = query(
        collection(db, 'vendor_registrations'),
        where('contactNumber', '==', identifier)
      );
      querySnapshot = await getDocs(phoneQuery);
      
      if (!querySnapshot.empty) {
        return { exists: true, method: 'phone' };
      }

      return { exists: false };
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw new Error('Failed to check user existence');
    }
  };

  // Register new user with email/password
  const registerUser = async (email, password, userData) => {
    try {
      setError(null);
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: userData.firstName
      });

      // Save user data to Firestore
      const userDocData = {
        uid: user.uid,
        email: user.email,
        username: userData.username,
        firstName: userData.firstName,
        contactNumber: userData.contactNumber,
        shopDetails: userData.shopDetails || {},
        bankDetails: userData.bankDetails || {},
        kycDocuments: userData.kycDocuments || {},
        createdAt: new Date().toISOString(),
        emailVerified: user.emailVerified,
        isActive: true
      };

      await setDoc(doc(db, 'vendor_registrations', user.uid), userDocData);

      // Also store phone mapping for backward compatibility
      if (userData.contactNumber) {
        const normalizedPhone = userData.contactNumber.replace(/\D/g, "");
        await setDoc(doc(db, "phones", normalizedPhone), { uid: user.uid });
      }

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already registered';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Login user with email/password
  const loginUser = async (email, password) => {
    try {
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
    
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'vendor_registrations', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }

      // Navigate("/dashboard");

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Upload KYC file (preserved from your original context)
  const uploadKycFile = async (file, userId, fileName) => {
    if (!file) throw new Error(`No ${fileName} file selected`);
    
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`${fileName} must be a PNG or JPEG image`);
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error(`${fileName} must be less than 5MB`);
    }

    const storageRef = ref(storage, `kyc/${userId}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  };

  // Legacy function names for backward compatibility (these now use email/password auth)
  const sendLoginOTP = async (email, password) => {
    // This is now a direct login instead of OTP
    return await loginUser(email, password);
  };

  const verifyLoginOTP = async (code) => {
    // This is no longer needed with email/password auth
    // But kept for compatibility - could be used for additional verification if needed
    console.warn('verifyLoginOTP is deprecated with email/password auth');
    return Promise.resolve();
  };

  const sendRegistrationOTP = async (email, password, userData) => {
    // This is now a direct registration instead of OTP
    return await registerUser(email, password, userData);
  };

  const verifyRegistrationOTP = async (code, completeUserData) => {
    // This is no longer needed with email/password auth
    // But kept for compatibility
    console.warn('verifyRegistrationOTP is deprecated with email/password auth');
    return Promise.resolve();
  };

  return (
    <AppContext.Provider
      value={{
        // Auth state
        currentUser,
        userData,
        loading,
        error,
        setError,
        clearError,

        // New email/password auth functions
        registerUser,
        loginUser,
        checkUserExists,
        signOut,

        // Legacy OTP function names (now use email/password)
        sendRegistrationOTP,
        sendLoginOTP,
        verifyRegistrationOTP,
        verifyLoginOTP,

        // File upload
        uploadKycFile,

        // Product data (preserved from your original context)
        productData,
        updateProductData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);