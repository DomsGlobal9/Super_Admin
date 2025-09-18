import { Bell, Menu, LogOut, X, Upload } from "lucide-react";
import dvyb from "../assets/mobile_logo_dvyb.svg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, storage } from "../firebaseConfig";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import profileLogo from "../assets/logo_profile.png";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState("");
// Instead of replacing user object, just update photoURL locally separately
const [userPhotoURL, setUserPhotoURL] = useState(null);

// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//     setUser(currentUser);
//     setUserPhotoURL(currentUser?.photoURL || null);
//   });
//   return () => unsubscribe();
// }, []);
// In your useEffect, add connection monitoring
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      // Verify the user can access Firebase Storage
      currentUser.getIdToken().then(token => {
        console.log('Auth token valid:', !!token);
      }).catch(err => {
        console.error('Auth token error:', err);
      });
    }
    
    setUser(currentUser);
    setUserPhotoURL(currentUser?.photoURL || null);
  });
  
  return () => unsubscribe();
}, []);

// const handleImageUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file || !user) return;

//   setUploading(true);
//   try {
//     const storageRef = ref(storage, `profile_images/${user.uid}`);
//     await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(storageRef);

//     await updateProfile(user, { photoURL: downloadURL });

//     setUserPhotoURL(downloadURL);  // update UI photo url separately
//   } catch (err) {
//     console.error("Error uploading image:", err.code, err.message || err);
//   }
//   setUploading(false);
// };

// const handleImageUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file || !user) return;

//   setUploading(true);
//   try {
//     // Force refresh ID token before upload
//     const idToken = await user.getIdToken(true);  // 'true' forces refresh
//     console.log('Refreshed ID Token:', idToken ? 'Valid' : 'Invalid');  // Debug log

//     const storageRef = ref(storage, `profile_images/${user.uid}`);
//     await uploadBytes(storageRef, file, { customMetadata: { firebaseStorageDownloadTokens: user.uid } });  // Optional: Add token for better access
//     const downloadURL = await getDownloadURL(storageRef);

//     await updateProfile(user, { photoURL: downloadURL });
//     setUserPhotoURL(downloadURL);
//   } catch (err) {
//     console.error("Upload Error:", err);
//     if (err.code === 'storage/unauthorized') {
//       // Force re-auth on unauthorized
//       await auth.currentUser?.getIdToken(true);
//       alert('Auth expired. Please refresh the page.');
//     }
//   } finally {
//     setUploading(false);
//   }
// };
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || !user) return;

  // Validate file
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    alert("Please upload an image file (JPEG, PNG, GIF, WebP)");
    return;
  }
  
  if (file.size > 2 * 1024 * 1024) {
    alert("Image size must be less than 2MB");
    return;
  }

  setUploading(true);

  try {
    // Ensure we have a valid auth token
    await user.getIdToken(true);
    
    // Create storage reference and upload
    const storageRef = ref(storage, `profile_images/${user.uid}`);
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    // Update user profile
    await updateProfile(user, { photoURL: downloadURL });
    
    // Update local state
    setUserPhotoURL(downloadURL);
    
    console.log('✅ Upload successful!');
    
  } catch (err) {
    console.error("Upload error:", err);
    alert(`Upload failed: ${err.message}`);
  } finally {
    setUploading(false);
  }
};

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("dvyb_admin_session");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // // 🔹 Upload profile image
  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file || !user) return;

  //   setUploading(true);
  //   try {
  //     const storageRef = ref(storage, `profile_images/${user.uid}`);
  //     await uploadBytes(storageRef, file);
  //     const downloadURL = await getDownloadURL(storageRef);

  //     // Update Firebase Auth profile
  //     await updateProfile(user, { photoURL: downloadURL });

  //     // Update UI
  //     setUser({ ...user, photoURL: downloadURL });
  //   } catch (err) {
  //     console.error("Error uploading image:", err);
  //   }
  //   setUploading(false);
  // };
//   const handleImageUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file || !user) return;

//   // Validate file type and size
//   const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
//   if (!allowedTypes.includes(file.type)) {
//     alert("Please upload an image file (jpeg, png, gif)");
//     return;
//   }
//   if (file.size > 1 * 1024 * 1024) { // 1MB limit
//     alert("Image size must be less than 1MB");
//     return;
//   }

//   setUploading(true);

//   try {
//     const storageRef = ref(storage, `profile_images/${user.uid}`);
//     await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(storageRef);

//     // Update Firebase Auth profile photoURL
//     await updateProfile(user, { photoURL: downloadURL });

//     // Update local UI state
//     setUser({ ...user, photoURL: downloadURL });
//   } catch (err) {
//     console.error("Error uploading image:", err.code, err.message || err);
//     alert(`Upload failed: ${err.message || err}`);
//   }

//   setUploading(false);
// };


  return (
    <header className="bg-white shadow-sm flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-gray-700"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
      </div>

      <img src={dvyb} className="block lg:hidden" alt="" />

      <div className="flex items-center gap-6">
        {/* Search bar */}
        <div className="hidden sm:flex items-center border border-black w-72 rounded-lg px-3 py-2">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 outline-none placeholder-black px-6 text-sm text-black"
          />
        </div>
        {/* Notifications */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/layout/notifications")}
        >
          <Bell className="text-gray-600" size={22} />
          {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            6
          </span> */}
        </div>
        {/* Profile */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            // src={user?.userPhotoURL || profileLogo}
            src={userPhotoURL || profileLogo}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="hidden sm:block">
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>

      {/* 🔹 Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 relative text-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 cursor-pointer text-gray-600 hover:text-black"
            >
              <X size={22} />
            </button>

            {/* Profile Image */}
            <img
              src={user?.photoURL || profileLogo}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
            />

            {/* Upload Image */}
            <label className="cursor-pointer flex items-center justify-center gap-2 text-blue-600 hover:underline">
              <Upload size={18} />
              {uploading ? "Uploading..." : "Change Profile Picture"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {/* Email */}
            <h3 className="text-gray-800 font-medium mt-3">
              {email || "superadmin@gmail.com"}
            </h3>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="mt-4 w-full cursor-pointer flex items-center gap-2 justify-center bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
