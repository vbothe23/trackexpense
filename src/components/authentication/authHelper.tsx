import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import { ToastAndroid } from "react-native";
import RNFS from "react-native-fs";

const GOOGLE_WELCIENT_ID = "";

export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
        webClientId: GOOGLE_WELCIENT_ID,
        scopes: ["https://www.googleapis.com/auth/drive.appdata"],
        offlineAccess: true,
        prompt: 'consent',
    });
}


export const signOut = async (): Promise<void> => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    ToastAndroid.show("Signout Successful", ToastAndroid.SHORT);
  } catch (error) {
    ToastAndroid.show("Signout Failed", ToastAndroid.SHORT);
    console.error("Signout Error: ", error);
  }
};

export const getAccessToken = async () => {
    try {
        const { accessToken } = await GoogleSignin.getTokens();
        return accessToken;
    } catch (error) {
        console.error("Error getting access token: ", error);
        throw error;
    }
}

export const uploadToGoogleDrive = async (accessToken: string, filePath: string) => {
  const form = new FormData();

  // Metadata as a string blob
  form.append('metadata', {
    string: JSON.stringify({
      name: 'backup.json',
      mimeType: 'application/json',
    }),
    type: 'application/json'
  });

  // File part
  form.append('file', {
    uri: `file://${filePath}`,
    type: 'application/json',
    name: 'backup.json',
  });

  try {
    const response = await axios.post(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      form,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Upload successful:', response.data);
  } catch (error) {
    console.log('Error details:', JSON.stringify(error, null, 2));
  }
};

export const downloadFromGoogleDrive = async (accessToken: string, fileId: string) => {
  try {
  const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  const response = await axios.get(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      responseType: 'text'
    });


    const localPath = `${RNFS.DocumentDirectoryPath}/backup.json`;
    // Save file locally
    await RNFS.writeFile(localPath, response.data, 'utf8');
    console.log('Downloaded and saved to:', localPath);
    return localPath;

  } catch (error) {
    ToastAndroid.show('Error downloading backup file', ToastAndroid.SHORT);
    // @ts-ignore
    console.error('Error downloading from Google Drive:', error.response?.data || error);
    throw error;
  }
};

export const getBackupFileId = async (accessToken: string) => {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/drive/v3/files',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          q: "name='backup.json'",
          fields: 'files(id, name)',
        },
      }
    );

    const files = response.data.files;
    if (files.length > 0) {
      console.log('Found file:', files[0]);
      return files[0].id;
    } else {
      console.log('No backup file found.');
      return null;
    }

  } catch (error) {
    // @ts-ignore
    console.error('Error fetching file list:', error.response?.data || error);
    throw error;
  }
};
