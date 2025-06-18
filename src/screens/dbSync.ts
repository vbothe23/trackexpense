import RNFS from 'react-native-fs';
import CryptoJS from 'crypto-js';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
// import GDrive from '@robinbobin/react-native-google-drive-api-wrapper';

const DB_PATH = `${RNFS.DocumentDirectoryPath}/watermelon.db`;
const ENCRYPTED_PATH = `${RNFS.DocumentDirectoryPath}/watermelon_encrypted.db`;
const SECRET_KEY = 'TEMP_SECRET_KEY_CHANGE_BEFORE_PROD';

const createBackup = async ( database: any ) => {
  const allCollections = await database.collections.get('your_collection').query().fetch();
  const json = JSON.stringify(allCollections);
  const backupPath = `${RNFS.DocumentDirectoryPath}/watermelon_backup.json`;
  await RNFS.writeFile(backupPath, json, 'utf8');
  return backupPath;
}

// export const uploadEncryptedDB = async () => {
//   try {
//     console.log('🔐 Encrypting and uploading DB to Google Drive...');

//     const dbDataBase64 = await RNFS.readFile(DB_PATH, 'base64');
//     const encrypted = CryptoJS.AES.encrypt(dbDataBase64, SECRET_KEY).toString();
//     await RNFS.writeFile(ENCRYPTED_PATH, encrypted, 'utf8');

//     const token = await GoogleSignin.getTokens();

//     const metadata = {
//       name: 'watermelon_encrypted.db',
//       mimeType: 'application/octet-stream',
//       parents: ['appDataFolder'],
//     };

//     const form = new FormData();
//     form.append(
//       'metadata',
//       new Blob([JSON.stringify(metadata)], { type: 'application/json', lastModified: Date.now() })
//     );
//     form.append(
//       'file',
//       new Blob([encrypted], { type: 'application/octet-stream', lastModified: Date.now() })
//     );

//     const response = await fetch(
//       'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token.accessToken}`,
//         },
//         body: form,
//       }
//     );

//     const result = await response.json();
//     console.log('✅ Upload successful:', result);
//   } catch (error) {
//     console.error('❌ Error uploading encrypted DB:', error);
//   }
// };

// export const downloadAndDecryptDB = async () => {
//   try {
//     console.log('⬇️ Downloading encrypted DB from Google Drive...');

//     const token = await GoogleSignin.getTokens();

//     const listRes = await fetch(
//       'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name="watermelon_encrypted.db"&fields=files(id,name)',
//       {
//         headers: {
//           Authorization: `Bearer ${token.accessToken}`,
//         },
//       }
//     );

//     const listJson = await listRes.json();
//     if (!listJson.files || listJson.files.length === 0) {
//       console.warn('⚠️ No encrypted DB found in Drive.');
//       return;
//     }

//     const fileId = listJson.files[0].id;
//     const downloadRes = await fetch(
//       `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
//       {
//         headers: {
//           Authorization: `Bearer ${token.accessToken}`,
//         },
//       }
//     );

//     const encryptedText = await downloadRes.text();
//     const decrypted = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
//     const base64Data = decrypted.toString(CryptoJS.enc.Utf8);

//     await RNFS.writeFile(DB_PATH, base64Data, 'base64');
//     console.log('✅ DB downloaded and decrypted successfully.');
//     console.log('🔄 You may need to restart the app to reload WatermelonDB.');
//   } catch (error) {
//     console.error('❌ Error downloading/decrypting DB:', error);
//   }
// };


// Function to get the WatermelonDB SQLite file path
// const getDatabaseFilePath = (dbName = 'watermelon.db') => {
//   if (Platform.OS === 'android') {
//     return `${RNFS.DocumentDirectoryPath}/${dbName}`;
//   } else if (Platform.OS === 'ios') {
//     return `${RNFS.DocumentDirectoryPath}/${dbName}`;
//   }
//   throw new Error('Unsupported platform');
// };

