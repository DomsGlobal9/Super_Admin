// import React, { useState, useEffect } from 'react';
// import { Search, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';

// // Firebase configuration (same as in VendorManagement)
// const firebaseConfig = {
//   apiKey: "AIzaSyCwlxdZKM8dagbu43v7NVFclex4QsTO4hw",
//   authDomain: "dvyb-8b572.firebaseapp.com",
//   databaseURL: "https://dvyb-8b572-default-rtdb.firebaseio.com",
//   projectId: "dvyb-8b572",
//   storageBucket: "dvyb-8b572.firebasestorage.app",
//   messagingSenderId: "288498435019",
//   appId: "1:288498435019:web:a20bce56f823c0ddad6c4e",
//   measurementId: "G-4GFNR7HKFS"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// const CommissionControl = () => {
//   const [defaultRate, setDefaultRate] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showSaveModal, setShowSaveModal] = useState(false);
//   const [originalValues, setOriginalValues] = useState({});
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch default commission rate and vendor data from Firestore
//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Fetch default commission rate from a settings document
//       const settingsDocRef = doc(db, 'settings', 'commission');
//       const settingsDoc = await getDoc(settingsDocRef);
//       let fetchedDefaultRate = 10; // Fallback default rate
//       if (settingsDoc.exists()) {
//         fetchedDefaultRate = settingsDoc.data().defaultRate || 10;
//       }
//       setDefaultRate(fetchedDefaultRate);

//       // Fetch vendors from Firestore
//       const vendorsRef = collection(db, 'users'); // Assuming vendors are in 'users' collection
//       const vendorsSnapshot = await getDocs(vendorsRef);
//       const fetchedVendors = [];

//       vendorsSnapshot.forEach((doc) => {
//         const data = doc.data();
//         fetchedVendors.push({
//           id: doc.id,
//           name: data.personalDetails?.name || data.firstName || data.username || data.fullName || 'Unknown Vendor',
//           rate: data.commissionRate || fetchedDefaultRate, // Use default rate if not set
//         });
//       });

//       setVendors(fetchedVendors);

//       // Initialize original values for change detection
//       setOriginalValues({
//         defaultRate: fetchedDefaultRate,
//         vendors: fetchedVendors.reduce((acc, vendor) => ({
//           ...acc,
//           [vendor.id]: vendor.rate
//         }), {})
//       });
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Check if there are unsaved changes
//   const hasChanges = () => {
//     if (defaultRate !== originalValues.defaultRate) return true;
    
//     return vendors.some(vendor => 
//       vendor.rate !== originalValues.vendors?.[vendor.id]
//     );
//   };

//   // Filter vendors based on search term
//   const filteredVendors = vendors.filter(vendor =>
//     vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Update vendor rate locally
//   const updateVendorRate = (vendorId, newRate) => {
//     setVendors(vendors.map(vendor =>
//       vendor.id === vendorId ? { ...vendor, rate: parseInt(newRate) || 0 } : vendor
//     ));
//   };

//   // Save changes to Firestore
//   const saveChanges = async () => {
//     try {
//       // Save default commission rate
//       const settingsDocRef = doc(db, 'settings', 'commission');
//       await setDoc(settingsDocRef, { defaultRate }, { merge: true });

//       // Save vendor-specific commission rates
//       const updatePromises = vendors.map(vendor =>
//         setDoc(doc(db, 'users', vendor.id), { commissionRate: vendor.rate }, { merge: true })
//       );
//       await Promise.all(updatePromises);

//       // Update original values
//       setOriginalValues({
//         defaultRate: defaultRate,
//         vendors: vendors.reduce((acc, vendor) => ({
//           ...acc,
//           [vendor.id]: vendor.rate
//         }), {})
//       });
//       setShowSaveModal(false);
//     } catch (err) {
//       console.error('Error saving changes:', err);
//       setError(err.message);
//     }
//   };

//   // Cancel changes
//   const cancelChanges = () => {
//     setShowSaveModal(false);
//     // Optionally, revert to original values
//     setDefaultRate(originalValues.defaultRate);
//     setVendors(vendors.map(vendor => ({
//       ...vendor,
//       rate: originalValues.vendors[vendor.id] || defaultRate
//     })));
//   };

//   // Handle navigation with change detection
//   const handleNavigation = (direction) => {
//     if (hasChanges()) {
//       setShowSaveModal(true);
//     } else {
//       console.log(`Navigating ${direction}`);
//       // Add actual navigation logic here (e.g., route change)
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <div className="text-red-500 mb-4">
//             <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">Error</h2>
//           <p className="text-gray-500 mb-4">{error}</p>
//           <button
//             onClick={fetchData}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto my-5 bg-white rounded-lg shadow-lg overflow-hidden">
//       {/* Header */}
//       <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
//         <h1 className="text-lg font-medium text-gray-900">Commission Control</h1>
//         <Menu className="w-6 h-6 text-gray-600 cursor-pointer" />
//       </div>

//       {/* Content */}
//       <div className="p-5">
//         {/* Global Settings */}
//         <div className="mb-6">
//           <h2 className="text-base font-medium mb-4 text-gray-900">Global Settings</h2>
//           <div className="bg-gray-50 border border-gray-200 rounded-md p-5">
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-black">Default Commission Rate</span>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="number"
//                   value={defaultRate}
//                   onChange={(e) => setDefaultRate(parseInt(e.target.value) || 0)}
//                   className="w-[60px] px-3 py-1.5 text-sm text-black text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <span className="text-sm text-gray-500">%</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Vendor-Specific Overrides */}
//         <div>
//           <h2 className="text-base font-medium mb-4 text-gray-900">Vendor-Specific Overrides</h2>
//           <div className="border border-gray-200 rounded-md bg-white">
//             {/* Search Box */}
//             <div className="p-4 border-b border-gray-200">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
//                 <input
//                   type="text"
//                   placeholder="Search vendors"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Vendor Header */}
//             <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
//               <span className="text-xs font-medium text-gray-600">Vendor</span>
//               <span className="text-xs font-medium text-gray-600">Commission Rate</span>
//             </div>

//             {/* Vendor Rows */}
//             {filteredVendors.length > 0 ? (
//               filteredVendors.map((vendor, index) => (
//                 <div
//                   key={vendor.id}
//                   className={`flex justify-between items-center px-4 py-3 text-sm ${
//                     index !== filteredVendors.length - 1 ? 'border-b border-gray-100' : ''
//                   }`}
//                 >
//                   <span className="text-gray-900">{vendor.name}</span>
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="number"
//                       value={vendor.rate}
//                       onChange={(e) => updateVendorRate(vendor.id, e.target.value)}
//                       className="w-12 px-2 py-1 text-sm text-center text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                     <span className="text-sm text-gray-500">%</span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-4 text-gray-500">
//                 No vendors found.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="flex justify-between items-center px-5 py-4 bg-gray-50 border-t border-gray-200">
//         <button
//           onClick={() => handleNavigation('previous')}
//           className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
//         >
//           <ChevronLeft className="w-4 h-4" />
//           Previous
//         </button>
//         <button
//           onClick={() => handleNavigation('next')}
//           className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
//         >
//           Next
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       </div>

//       {/* Save Changes Modal */}
//       {showSaveModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 min-w-80 shadow-xl">
//             <h3 className="text-lg font-medium mb-4 text-gray-900">Save changes?</h3>
//             <p className="text-sm text-gray-600 mb-5">
//               You have unsaved changes to commission rates. Would you like to save them before proceeding?
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={cancelChanges}
//                 className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveChanges}
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700 transition-colors"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CommissionControl;

import React, { useState, useEffect } from 'react';
import { Search, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwlxdZKM8dagbu43v7NVFclex4QsTO4hw",
  authDomain: "dvyb-8b572.firebaseapp.com",
  databaseURL: "https://dvyb-8b572-default-rtdb.firebaseio.com",
  projectId: "dvyb-8b572",
  storageBucket: "dvyb-8b572.firebasestorage.app",
  messagingSenderId: "288498435019",
  appId: "1:288498435019:web:a20bce56f823c0ddad6c4e",
  measurementId: "G-4GFNR7HKFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CommissionControl = () => {
  const [defaultRate, setDefaultRate] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [originalValues, setOriginalValues] = useState({});
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to safely extract vendor name
  const extractVendorName = (data) => {
    // Function to safely check and return a valid string
    const safeString = (value) => {
      if (!value || value === 'undefined' || value === 'null') return null;
      const str = String(value).trim();
      return str && str !== 'undefined' && str !== 'null' ? str : null;
    };

    // Try different name fields in order of preference
    const nameFields = [
      'businessName',
      'companyName', 
      'vendorName',
      'ownerName',
      'contactPersonName',
      'name',
      'fullName',
      'displayName',
      'userName'
    ];

    // Check each field
    for (const field of nameFields) {
      const name = safeString(data[field]);
      if (name) return name;
    }

    // Try combining first and last name
    const firstName = safeString(data.firstName);
    const lastName = safeString(data.lastName);
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }

    // Try email as last resort
    const email = safeString(data.email);
    if (email && email.includes('@')) {
      const emailPrefix = email.split('@')[0];
      if (emailPrefix && emailPrefix !== 'undefined') {
        return emailPrefix;
      }
    }

    return null; // No valid name found
  };

  // Fetch default commission rate and vendor data from Firestore
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch default commission rate from settings document
      const settingsDocRef = doc(db, 'settings', 'commission');
      const settingsDoc = await getDoc(settingsDocRef);
      let fetchedDefaultRate = 10; // Fallback default rate
      if (settingsDoc.exists()) {
        fetchedDefaultRate = settingsDoc.data().defaultRate || 10;
      }
      setDefaultRate(fetchedDefaultRate);

      // Fetch vendors from vendor_registrations collection
      const vendorsRef = collection(db, 'vendor_registrations');
      const vendorsSnapshot = await getDocs(vendorsRef);
      const fetchedVendors = [];

      vendorsSnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Extract vendor name using our safe function
        const vendorName = extractVendorName(data);
        
        // Only process vendors with valid names
        if (vendorName) {
          // Use custom commission rate if set, otherwise use default rate
          const commissionRate = data.commissionRate !== undefined 
            ? data.commissionRate 
            : fetchedDefaultRate;

          fetchedVendors.push({
            id: doc.id,
            name: vendorName,
            rate: commissionRate,
            email: data.email || '',
            phone: data.phone || data.phoneNumber || data.mobile || '',
            businessType: data.businessType || data.category || '',
            status: data.status || 'active'
          });
        } else {
          // Log vendors that are being excluded
          console.warn('Vendor excluded due to missing name:', {
            id: doc.id,
            availableFields: Object.keys(data),
            sampleData: {
              businessName: data.businessName,
              name: data.name,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email
            }
          });
        }
      });

      // Sort vendors by name
      fetchedVendors.sort((a, b) => a.name.localeCompare(b.name));
      
      setVendors(fetchedVendors);

      // Initialize original values for change detection
      setOriginalValues({
        defaultRate: fetchedDefaultRate,
        vendors: fetchedVendors.reduce((acc, vendor) => ({
          ...acc,
          [vendor.id]: vendor.rate
        }), {})
      });
      
      console.log(`Loaded ${fetchedVendors.length} vendors with valid names`);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Update all vendor rates when default rate changes
  useEffect(() => {
    if (originalValues.defaultRate !== undefined) {
      setVendors(prevVendors => 
        prevVendors.map(vendor => {
          // Only update if vendor doesn't have a custom rate set
          const hasCustomRate = originalValues.vendors?.[vendor.id] !== originalValues.defaultRate;
          if (!hasCustomRate) {
            return { ...vendor, rate: defaultRate };
          }
          return vendor;
        })
      );
    }
  }, [defaultRate, originalValues]);

  // Check if there are unsaved changes
  const hasChanges = () => {
    if (defaultRate !== originalValues.defaultRate) return true;
    
    return vendors.some(vendor => 
      vendor.rate !== originalValues.vendors?.[vendor.id]
    );
  };

  // Filter vendors based on search term - only show vendors with valid names
  const filteredVendors = vendors.filter(vendor => {
    // Double-check that vendor has a valid name (shouldn't be needed but extra safety)
    if (!vendor.name || 
        vendor.name === 'undefined' || 
        vendor.name === 'null' ||
        vendor.name.toLowerCase() === 'undefined' ||
        vendor.name.toLowerCase() === 'null' ||
        vendor.name.trim() === '') {
      return false;
    }

    // Apply search filter
    if (!searchTerm.trim()) {
      return true;
    }

    const searchLower = searchTerm.toLowerCase();
    return vendor.name.toLowerCase().includes(searchLower) ||
           (vendor.email && vendor.email.toLowerCase().includes(searchLower)) ||
           (vendor.phone && vendor.phone.includes(searchTerm));
  });

  // Update vendor rate locally
  const updateVendorRate = (vendorId, newRate) => {
    const rate = parseInt(newRate) || 0;
    setVendors(vendors.map(vendor =>
      vendor.id === vendorId ? { ...vendor, rate: rate } : vendor
    ));
  };

  // Reset vendor to default rate
  const resetToDefault = (vendorId) => {
    setVendors(vendors.map(vendor =>
      vendor.id === vendorId ? { ...vendor, rate: defaultRate } : vendor
    ));
  };

  // Save changes to Firestore
  const saveChanges = async () => {
    try {
      setError(null);
      
      // Save default commission rate
      const settingsDocRef = doc(db, 'settings', 'commission');
      await setDoc(settingsDocRef, { defaultRate }, { merge: true });

      // Save vendor-specific commission rates
      const updatePromises = vendors.map(vendor =>
        setDoc(doc(db, 'vendor_registrations', vendor.id), { commissionRate: vendor.rate }, { merge: true })
      );
      await Promise.all(updatePromises);

      // Update original values
      setOriginalValues({
        defaultRate: defaultRate,
        vendors: vendors.reduce((acc, vendor) => ({
          ...acc,
          [vendor.id]: vendor.rate
        }), {})
      });
      
      setShowSaveModal(false);
      alert('Commission rates saved successfully!');
    } catch (err) {
      console.error('Error saving changes:', err);
      setError('Failed to save changes: ' + err.message);
    }
  };

  // Cancel changes
  const cancelChanges = () => {
    setShowSaveModal(false);
    // Revert to original values
    setDefaultRate(originalValues.defaultRate);
    setVendors(vendors.map(vendor => ({
      ...vendor,
      rate: originalValues.vendors[vendor.id] || originalValues.defaultRate
    })));
  };

  // Handle navigation with change detection
  const handleNavigation = (direction) => {
    if (hasChanges()) {
      setShowSaveModal(true);
    } else {
      console.log(`Navigating ${direction}`);
      // Add actual navigation logic here
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading commission data...</h2>
          <p className="text-gray-500 mt-2">Fetching vendor information from database</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Data</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-5 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Commission Control</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage commission rates for {vendors.length} registered vendors
          </p>
        </div>
        <Menu className="w-6 h-6 text-gray-600 cursor-pointer" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Global Settings */}
        <div className="mb-6">
          <h2 className="text-base font-medium mb-4 text-gray-900">Global Settings</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-5">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-900">Default Commission Rate</span>
                <p className="text-xs text-gray-600 mt-1">
                  Applied to all vendors unless individually overridden
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={defaultRate}
                  onChange={(e) => setDefaultRate(parseInt(e.target.value) || 0)}
                  className="w-[70px] px-3 py-2 text-sm font-medium text-gray-900 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor-Specific Overrides */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-medium text-gray-900">Vendor Commission Rates</h2>
            {hasChanges() && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-orange-600">●</span>
                <span className="text-sm text-orange-600 font-medium">Unsaved changes</span>
              </div>
            )}
          </div>
          
          <div className="border border-gray-200 rounded-md bg-white">
            {/* Search Box */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by vendor name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {searchTerm && (
                <p className="text-xs text-gray-600 mt-2">
                  Showing {filteredVendors.length} of {vendors.length} vendors
                </p>
              )}
            </div>

            {/* Vendor Header */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-100 border-b border-gray-200">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Vendor Details
              </span>
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Commission Rate
              </span>
            </div>

            {/* Vendor Rows */}
            {filteredVendors.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {filteredVendors.map((vendor, index) => {
                  const isUsingDefault = vendor.rate === defaultRate;
                  const hasCustomRate = originalValues.vendors?.[vendor.id] !== originalValues.defaultRate;
                  
                  return (
                    <div
                      key={vendor.id}
                      className={`flex justify-between items-center px-4 py-3 hover:bg-gray-50 ${
                        index !== filteredVendors.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{vendor.name}</span>
                          {hasCustomRate && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Custom Rate
                            </span>
                          )}
                        </div>
                        {(vendor.email || vendor.phone) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {vendor.email && <span>{vendor.email}</span>}
                            {vendor.email && vendor.phone && <span> • </span>}
                            {vendor.phone && <span>{vendor.phone}</span>}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={vendor.rate}
                          onChange={(e) => updateVendorRate(vendor.id, e.target.value)}
                          className={`w-16 px-2 py-1 text-sm text-center font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isUsingDefault 
                              ? 'border-gray-300 text-gray-700 bg-gray-50' 
                              : 'border-blue-300 text-blue-900 bg-blue-50'
                          }`}
                        />
                        <span className="text-sm text-gray-500 w-4">%</span>
                        {!isUsingDefault && (
                          <button
                            onClick={() => resetToDefault(vendor.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                            title="Reset to default rate"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="font-medium">No vendors found</p>
                <p className="text-sm">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="font-medium">No vendors registered</p>
                <p className="text-sm">Vendors will appear here once they register</p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {hasChanges() && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowSaveModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center px-5 py-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => handleNavigation('previous')}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={() => handleNavigation('next')}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Save Changes Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-96 shadow-xl">
            <h3 className="text-lg font-medium mb-4 text-gray-900">Save Commission Changes?</h3>
            <div className="mb-5">
              <p className="text-sm text-gray-600 mb-3">
                You have unsaved changes to commission rates:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                {defaultRate !== originalValues.defaultRate && (
                  <li>• Default rate: {originalValues.defaultRate}% → {defaultRate}%</li>
                )}
                {vendors.filter(v => v.rate !== originalValues.vendors?.[v.id]).map(vendor => (
                  <li key={vendor.id}>
                    • {vendor.name}: {originalValues.vendors?.[vendor.id] || 'N/A'}% → {vendor.rate}%
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelChanges}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionControl;