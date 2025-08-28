// services/firebaseService.js
// import { 
//   collection, 
//   addDoc, 
//   getDocs, 
//   doc, 
//   updateDoc, 
//   deleteDoc, 
//   query, 
//   orderBy,
//   serverTimestamp,
//   getDoc 
// } from 'firebase/firestore';
// import { 
//   ref, 
//   uploadBytes, 
//   getDownloadURL, 
//   deleteObject 
// } from 'firebase/storage';
import { db, storage } from '../firebaseConfig'; // Adjust the import path as needed

class FirebaseService {
  // Upload multiple images to Firebase Storage
  async uploadImages(imageFiles) {
    try {
      const uploadPromises = imageFiles.map(async (file, index) => {
        const fileName = `${Date.now()}_${index}_${file.name}`;
        const storageRef = ref(storage, `product_images/${fileName}`);
        
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return downloadURL;
      });

      const downloadURLs = await Promise.all(uploadPromises);
      return downloadURLs;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error(`Failed to upload images: ${error.message}`);
    }
  }

  // Convert form data to Firebase format
  formatProductData(formData, imageUrls = [], userId) {
    return {
      // Basic product info
      title: formData.title || '',
      description: formData.description || '',
      category: formData.chooseType || '',
      productType: formData.productType || 'Ready to Wear',
      dressType: formData.dressType || '',
      material: formData.materialType || '',
      design: formData.designType || '',
      
      // Pricing and inventory
      price: formData.price || '0',
      selectedSizes: formData.selectedSizes || [],
      selectedColors: formData.selectedColors || [],
      units: formData.units || {},
      
      // Images and metadata
      imageUrls: imageUrls.length > 0 ? imageUrls : formData.images || [],
      timestamp: serverTimestamp(),
      userId: userId, // Store the user ID
      
      // Status and visibility
      status: 'active',
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Save product to user's subcollection with enhanced debugging
  async saveProduct(formData, userId, imageFiles = null) {
    try {
      console.log('🔍 Starting saveProduct...');
      console.log('📋 Input params:', { 
        hasFormData: !!formData, 
        userId: userId, 
        hasImageFiles: !!imageFiles && imageFiles.length > 0 
      });

      if (!userId) {
        throw new Error('User ID is required to save product');
      }

      let imageUrls = formData.images || [];
      
      // Upload new images if provided
      if (imageFiles && imageFiles.length > 0) {
        console.log('📁 Uploading new images...');
        const uploadedUrls = await this.uploadImages(imageFiles);
        imageUrls = [...imageUrls, ...uploadedUrls];
        console.log('✅ Images uploaded successfully');
      }

      // Format data for Firebase
      const productData = this.formatProductData(formData, imageUrls, userId);
      
      console.log('📝 Formatted product data:');
      console.log('   - Title:', productData.title);
      console.log('   - User ID:', productData.userId);
      console.log('   - Image count:', productData.imageUrls.length);
      console.log('   - Price:', productData.price);
      
      // Create collection reference
      const collectionPath = `users/${userId}/products`;
      console.log('📍 Collection path:', collectionPath);
      
      const userProductsCollection = collection(db, "users", userId, "products");
      
      // Save to user's products subcollection
      console.log('💾 Attempting to save to Firestore...');
      const docRef = await addDoc(userProductsCollection, productData);
      
      console.log('✅ SUCCESS! Product saved with ID:', docRef.id);
      console.log('🔗 Full document path: users/' + userId + '/products/' + docRef.id);
      
      // Verify the document exists by reading it back
      console.log('🔍 Verifying document was saved...');
      try {
        const verification = await getDoc(docRef);
        if (verification.exists()) {
          console.log('✅ VERIFICATION SUCCESS: Document exists in Firestore');
          console.log('📊 Saved data sample:', {
            title: verification.data().title,
            userId: verification.data().userId,
            timestamp: verification.data().timestamp
          });
        } else {
          console.error('❌ VERIFICATION FAILED: Document does not exist after save');
        }
      } catch (verifyError) {
        console.error('❌ VERIFICATION ERROR:', verifyError);
      }
      
      return {
        success: true,
        productId: docRef.id,
        message: 'Product saved successfully!',
        path: collectionPath + '/' + docRef.id
      };
      
    } catch (error) {
      console.error('💥 ERROR in saveProduct:', error);
      console.error('📋 Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack?.split('\n').slice(0, 3)
      });
      
      // Check for specific Firebase errors
      if (error.code === 'permission-denied') {
        console.error('🚫 PERMISSION DENIED - Check Firestore security rules');
        console.error('   Required rule: match /users/{userId}/{document=**} { allow read, write: if request.auth != null && request.auth.uid == userId; }');
      } else if (error.code === 'unauthenticated') {
        console.error('🔐 UNAUTHENTICATED - User is not logged in');
      }
      
      throw new Error(`Failed to save product: ${error.message}`);
    }
  }

  // Test Firestore connection and permissions
  async testFirestoreConnection(userId) {
    try {
      console.log('🧪 Testing Firestore connection and permissions...');
      
      if (!userId) {
        console.error('❌ No userId provided for test');
        return { success: false, error: 'No userId provided' };
      }
      
      // Test 1: Simple write to root collection
      console.log('Test 1: Writing to root test collection...');
      const testData1 = {
        test: 'root test',
        timestamp: new Date().toISOString(),
        userId: userId
      };
      
      const rootTestRef = await addDoc(collection(db, 'test'), testData1);
      console.log('✅ Root test successful, ID:', rootTestRef.id);
      
      // Test 2: Write to user subcollection
      console.log('Test 2: Writing to user subcollection...');
      const testData2 = {
        test: 'user subcollection test',
        timestamp: new Date().toISOString(),
        userId: userId
      };
      
      const userTestRef = await addDoc(collection(db, 'users', userId, 'test'), testData2);
      console.log('✅ User subcollection test successful, ID:', userTestRef.id);
      console.log('   Path: users/' + userId + '/test/' + userTestRef.id);
      
      // Test 3: Read back the data
      console.log('Test 3: Reading back user subcollection data...');
      const readDoc = await getDoc(userTestRef);
      if (readDoc.exists()) {
        console.log('✅ Read test successful:', readDoc.data());
      } else {
        console.error('❌ Read test failed - document not found');
      }
      
      return { 
        success: true, 
        message: 'All Firestore tests passed!',
        rootTestId: rootTestRef.id,
        userTestId: userTestRef.id
      };
      
    } catch (error) {
      console.error('💥 Firestore test failed:', error);
      return { 
        success: false, 
        error: error.message,
        code: error.code 
      };
    }
  }


  

  // Update existing product in user's subcollection
  async updateProduct(productId, userId, formData, imageFiles = null) {
    try {
      if (!userId) {
        throw new Error('User ID is required to update product');
      }

      let imageUrls = formData.images || [];
      
      // Upload new images if provided
      if (imageFiles && imageFiles.length > 0) {
        const uploadedUrls = await this.uploadImages(imageFiles);
        imageUrls = [...imageUrls, ...uploadedUrls];
      }

      // Format data for Firebase
      const productData = this.formatProductData(formData, imageUrls, userId);
      productData.updatedAt = new Date().toISOString();
      
      // Update in user's products subcollection
      const docRef = doc(db, "users", userId, "products", productId);
      await updateDoc(docRef, productData);
      
      return {
        success: true,
        productId: productId,
        message: 'Product updated successfully!'
      };
      
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  // Get all products for a specific user
  async getUserProducts(userId) {
    try {
      console.log('📖 Fetching products for user:', userId);
      
      if (!userId) {
        throw new Error('User ID is required to fetch products');
      }

      const q = query(
        collection(db, "users", userId, "products"),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const products = [];
      
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`✅ Found ${products.length} products for user ${userId}`);
      if (products.length > 0) {
        console.log('📋 First product sample:', {
          id: products[0].id,
          title: products[0].title,
          userId: products[0].userId
        });
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching user products:', error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  // Get single product by ID from user's subcollection
  async getUserProduct(userId, productId) {
    try {
      if (!userId || !productId) {
        throw new Error('User ID and Product ID are required');
      }

      const docRef = doc(db, "users", userId, "products", productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }

  // Delete product from user's subcollection
  async deleteUserProduct(userId, productId) {
    try {
      if (!userId || !productId) {
        throw new Error('User ID and Product ID are required');
      }

      // Get product data first to delete associated images
      const product = await this.getUserProduct(userId, productId);
      
      // Delete associated images from storage
      if (product.imageUrls && product.imageUrls.length > 0) {
        const deletePromises = product.imageUrls.map(async (imageUrl) => {
          try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.warn('Error deleting image:', error);
          }
        });
        
        await Promise.all(deletePromises);
      }
      
      // Delete product document from user's subcollection
      const docRef = doc(db, "users", userId, "products", productId);
      await deleteDoc(docRef);
      
      return {
        success: true,
        message: 'Product deleted successfully!'
      };
      
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  // Toggle product status in user's subcollection
  async toggleUserProductStatus(userId, productId, isPublished) {
    try {
      if (!userId || !productId) {
        throw new Error('User ID and Product ID are required');
      }

      const docRef = doc(db, "users", userId, "products", productId);
      await updateDoc(docRef, {
        isPublished: isPublished,
        updatedAt: new Date().toISOString()
      });
      
      return {
        success: true,
        message: `Product ${isPublished ? 'published' : 'unpublished'} successfully!`
      };
      
    } catch (error) {
      console.error('Error updating product status:', error);
      throw new Error(`Failed to update product status: ${error.message}`);
    }
  }

  // Legacy methods for backward compatibility (now deprecated)
  async getAllProducts() {
    console.warn('getAllProducts is deprecated. Use getUserProducts(userId) instead.');
    return [];
  }

  async getProductById(productId) {
    console.warn('getProductById is deprecated. Use getUserProduct(userId, productId) instead.');
    throw new Error('Please provide userId and use getUserProduct instead');
  }

  async deleteProduct(productId) {
    console.warn('deleteProduct is deprecated. Use deleteUserProduct(userId, productId) instead.');
    throw new Error('Please provide userId and use deleteUserProduct instead');
  }

  async toggleProductStatus(productId, isPublished) {
    console.warn('toggleProductStatus is deprecated. Use toggleUserProductStatus(userId, productId, isPublished) instead.');
    throw new Error('Please provide userId and use toggleUserProductStatus instead');
  }
}

// Create and export a singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;