// import { Bell, Menu, LogOut, X, Upload } from "lucide-react";
// import dvyb from "../assets/dvybeLogo.png";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { auth, storage } from "../firebaseConfig";
// import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import profileLogo from "../assets/logo_profile.png";

// const Navbar = ({ toggleSidebar }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       // setEmail(localStorage.getItem(email))
//       // console.log(localStorage.getItem(email))
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       localStorage.removeItem("dvyb_admin_session");
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout Error:", error);
//     }
//   };

//   // 🔹 Upload profile image
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !user) return;

//     setUploading(true);
//     try {
//       const storageRef = ref(storage, `profileImages/${user.uid}`);
//       await uploadBytes(storageRef, file);
//       const downloadURL = await getDownloadURL(storageRef);

//       // Update Firebase Auth profile
//       await updateProfile(user, { photoURL: downloadURL });

//       // Update UI
//       setUser({ ...user, photoURL: downloadURL });
//     } catch (err) {
//       console.error("Error uploading image:", err);
//     }
//     setUploading(false);
//   };

//   return (
//     <header className="bg-white shadow-sm flex items-center justify-between px-6 py-3">
//       <div className="flex items-center gap-3">
//         <button
//           className="lg:hidden text-gray-700"
//           onClick={toggleSidebar}
//           aria-label="Toggle Sidebar"
//         >
//           <Menu size={24} />
//         </button>
//       </div>

//       <img src={dvyb} className="block lg:hidden" alt="" />

//       <div className="flex items-center gap-6">
//         {/* Search bar */}
//         <div className="hidden sm:flex items-center border border-black w-72 rounded-lg px-3 py-2">
//           <input
//             type="text"
//             placeholder="Search"
//             className="flex-1 outline-none placeholder-black px-6 text-sm text-black"
//           />
//         </div>
//         {/* Notifications */}
//         <div
//           className="relative cursor-pointer"
//           onClick={() => navigate("/layout/notifications")}
//         >
//           <Bell className="text-gray-600" size={22} />
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
//             6
//           </span>
//         </div>
//         {/* Profile */}
//         <div
//           className="flex items-center gap-3 cursor-pointer"
//           onClick={() => setIsModalOpen(true)}
//         >
//           <img
//             src={user?.photoURL || profileLogo}
//             alt="profile"
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <div className="hidden sm:block">
//             <p className="text-xs text-gray-500">Super Admin</p>
//           </div>
//         </div>
//       </div>

//       {/* 🔹 Profile Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-2xl shadow-lg w-80 relative text-center">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-3 right-3 cursor-pointer text-gray-600 hover:text-black"
//             >
//               <X size={22} />
//             </button>

//             {/* Profile Image */}
//             <img
//               src={user?.photoURL || profileLogo}
//               alt="Profile"
//               className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
//             />

//             {/* Upload Image */}
//             <label className="cursor-pointer flex items-center justify-center gap-2 text-blue-600 hover:underline">
//               <Upload size={18} />
//               {uploading ? "Uploading..." : "Change Profile Picture"}
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageUpload}
//               />
//             </label>

//             {/* Email */}
//             <h3 className="text-gray-800 font-medium mt-3">
//               {email || "superadmin@gmail.com"}
//             </h3>

//             {/* Logout Button */}
//             <button
//               onClick={handleLogout}
//               className="mt-4 w-full cursor-pointer flex items-center gap-2 justify-center bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100"
//             >
//               <LogOut size={20} /> Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;


import { Bell, Menu, LogOut, X, Upload, Camera } from "lucide-react";
import dvyb from "../assets/dvybeLogo.png";
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
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setEmail(currentUser.email || localStorage.getItem("email") || "");
      }
    });
    return () => unsubscribe();
  }, []);

  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("dvyb_admin_session");
      localStorage.removeItem("email");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // 🔹 Upload profile image with proper error handling
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError("Please select a valid image file");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      // Use the correct path that matches your Firebase rules
      const storageRef = ref(storage, `profile_images/${user.uid}`);
      
      console.log("Uploading to path:", `profile_images/${user.uid}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Upload successful:", snapshot);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL:", downloadURL);

      // Update Firebase Auth profile
      await updateProfile(user, { photoURL: downloadURL });
      console.log("Profile updated successfully");

      // Force re-render by updating user state
      setUser({ ...user, photoURL: downloadURL });
      setUploadSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
      
    } catch (err) {
      console.error("Error uploading image:", err);
      
      // Handle specific Firebase errors
      if (err.code === 'storage/unauthorized') {
        setUploadError("Permission denied. Please check your authentication.");
      } else if (err.code === 'storage/canceled') {
        setUploadError("Upload was canceled.");
      } else if (err.code === 'storage/unknown') {
        setUploadError("An unknown error occurred. Please try again.");
      } else {
        setUploadError(`Upload failed: ${err.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  // Clear error messages when modal closes
  const closeModal = () => {
    setIsModalOpen(false);
    setUploadError("");
    setUploadSuccess(false);
  };

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
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            6
          </span>
        </div>
        
        {/* Profile */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="relative">
            <img
              src={user?.photoURL || profileLogo}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>

      {/* 🔹 Enhanced Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 relative text-center">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={22} />
            </button>

            {/* Profile Image with Upload Overlay */}
            <div className="relative inline-block mb-4">
              <img
                key={user?.photoURL || 'default'} // Force re-render when photoURL changes
                src={user?.photoURL || localStorage.getItem('userPhotoURL') || profileLogo}
                alt="Profile"
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-gray-100"
                onError={(e) => {
                  e.target.src = profileLogo; // Fallback if image fails to load
                }}
              />
              
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Camera overlay on hover */}
              <label className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full flex items-center justify-center cursor-pointer transition-all group">
                <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Upload Button */}
            <label className="cursor-pointer inline-flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors mb-3">
              <Upload size={18} />
              <span>
                {uploading ? "Uploading..." : "Change Profile Picture"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>

            {/* Success Message */}
            {uploadSuccess && (
              <div className="mb-3 p-2 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                ✅ Profile picture updated successfully!
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                ❌ {uploadError}
              </div>
            )}

            {/* User Info */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h3 className="text-gray-800 font-medium text-lg">
                {user?.displayName || "Super Admin"}
              </h3>
              <p className="text-gray-600 text-sm">
                {email || user?.email || "superadmin@gmail.com"}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                UID: {user?.uid?.substring(0, 8)}...
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full cursor-pointer flex items-center gap-2 justify-center bg-red-50 text-red-600 p-3 rounded-lg hover:bg-red-100 transition-colors font-medium"
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