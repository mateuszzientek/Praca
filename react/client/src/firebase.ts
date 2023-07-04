import { initializeApp } from 'firebase/app';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {

    apiKey: "AIzaSyCE3JEo6cKawsUCyjn-8nAaqPYbPHgb3nU",
  
    authDomain: "sneakerszone-a05ac.firebaseapp.com",
  
    projectId: "sneakerszone-a05ac",
  
    storageBucket: "sneakerszone-a05ac.appspot.com",
  
    messagingSenderId: "704635807517",
  
    appId: "1:704635807517:web:e129b98e0c52d34e6263f4"
  
  };
  

const app = initializeApp(firebaseConfig);
const storage: FirebaseStorage = getStorage(app);

export default storage;