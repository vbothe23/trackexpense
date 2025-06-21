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