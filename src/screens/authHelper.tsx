import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { exportDataToJson } from "../db/queries/models";
import { database } from "../db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import RNFS from "react-native-fs";
import { CategoryModel } from "../db/model/models";

export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
        webClientId: "",
        scopes: ["https://www.googleapis.com/auth/drive.appdata"],
        offlineAccess: true,
    });
}

export const getAccessToken = async () => {
    try {
        const { accessToken } = await GoogleSignin.getTokens();
        return accessToken;
    } catch (error) {
        console.error("Error getting access token: ", error);
        throw error;
    }
}

// export const uploadToGoogleDrive = async (accessToken:any, filePath:any) => {

//   const metadata = {
//   name: 'backup.json',
//   mimeType: 'application/json',
// }

// const fileContent = await RNFS.readFile(filePath, 'utf8')

// const boundary = 'foo_bar_baz'
// const multipartRequestBody =
//   `--${boundary}\r\n` +
//   'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
//   JSON.stringify(metadata) + '\r\n' +
//   `--${boundary}\r\n` +
//   'Content-Type: application/json\r\n\r\n' +
//   fileContent + '\r\n' +
//   `--${boundary}--`

//   await axios.post(
//   'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
//   multipartRequestBody,
//   {
//     headers: {
//       'Authorization': `Bearer ${accessToken}`,
//       'Content-Type': `multipart/related; boundary=${boundary}`,
//     },
//   }
// ).then((response) => {
//   console.log("Upload successful:", response.data);
// }).catch((error) => {
//   console.error("Error uploading to Google Drive:", error);
// });
// [19:37:43] E | ReactNativeJS ▶︎ 'Error syncing data:', [AxiosError: Request failed with status code 400]


// export const uploadToGoogleDrive = async (accessToken: string, filePath: string) => {
//   const metadata = {
//     name: 'backup.json',
//     mimeType: 'application/json',
//   }

//   const fileContent = await RNFS.readFile(filePath, 'utf8')

//   const form = new FormData()
//   form.append('metadata', JSON.stringify(metadata))
//   form.append('file', {
//     uri: `file://${filePath}`,
//     type: 'application/json',
//     name: 'backup.json',
//   })

//   await axios.post(
//     'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
//     form,
//     {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     }
//   ).then((response) => {
//     console.log("Upload successful:", response.data);
//   }).catch((error) => {
//     console.error("Error uploading to Google Drive:", error.response?.data || error);
//   });
// }

// [19:41:37] E | ReactNativeJS ▶︎ 'Error uploading to Google Drive:', { error:
//                              │ { code: 400,
//                              │ message: 'Unsupported content with type: application/octet-stream',
//                              │ errors:
//                              │ [ { message: 'Unsupported content with type: application/octet-stream',
//                              │ domain: 'global',
//                              └ reason: 'badContent' } ] } }


export const uploadToGoogleDrive = async (accessToken: string, filePath: string) => {
  const metadata = {
    name: 'backup.json',
    mimeType: 'application/json',
  };

  const form = new FormData();

  form.append('metadata', {
    string: JSON.stringify(metadata),
    type: 'application/json'
  });

  form.append('file', {
    uri: `file://${filePath}`,
    type: 'application/json',
    name: 'backup.json',
  });

  await axios.post(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    form,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  ).then((response) => {
    console.log("Upload successful:", response.data);
  }).catch((error) => {
    console.error("Error uploading to Google Drive:", error.response?.data || error);
  });
};



export const downloadFromGoogleDrive = async (accessToken: string, fileId: string) => {
  try {
    // Drive file download URL
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

    // Download file content
    const response = await axios.get(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      responseType: 'text'  // important: expect plain text/json string
    });

    // Define local save path
    const localPath = `${RNFS.DocumentDirectoryPath}/backup.json`;

    // Save file locally
    await RNFS.writeFile(localPath, response.data, 'utf8');

    console.log('Downloaded and saved to:', localPath);
    return localPath;

  } catch (error) {
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
    console.error('Error fetching file list:', error.response?.data || error);
    throw error;
  }
};


  // const form = new FormData();
  // form.append('metadata', JSON.stringify(metadata));
  // form.append('file', {
  //   uri: 'file://' + filePath,
  //   type: 'application/json',
  //   name: 'backup.json'
  // });

  // const res = await axios.post(
  //   'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
  //   form,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       'Content-Type': 'multipart/related; boundary=foo_bar_baz',
  //     }
  //   }
  // )





// export const uploadToGoogleDrive = async () => {

//     const { accessToken } = await GoogleSignin.getTokens();
//     const metadata = {
//   name: "sync-data.json",
//   mimeType: "application/json",
//   parents: ["appDataFolder"],
// };

// const fileContent = JSON.stringify({ your: "data" });
// const boundary = "foo_bar_baz";

// const multipartRequestBody =
//   `--${boundary}\r\n` +
//   'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
//   JSON.stringify(metadata) + '\r\n' +
//   `--${boundary}\r\n` +
//   'Content-Type: application/json\r\n\r\n' +
//   fileContent + '\r\n' +
//   `--${boundary}--`;

// const response = await fetch(
//   "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
//   {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": `multipart/related; boundary=${boundary}`,
//     },
//     body: multipartRequestBody,
//   }
// );

// if (!response.ok) {
//   const errorText = await response.text();
//   console.error("Google Drive API error: ", errorText);
//   throw new Error("Google Drive API error: " + errorText);
// }

// const result = await response.json();
// console.log("Upload successful. File ID: ", result.id);
// }

// export const uploadToGoogleDrive = async () => {
//   console.log('Uploading data to Google Drive...');

//   try {
//     // Get JSON data (assuming exportDataToJson returns a string)
//     const jsonString = await exportDataToJson();
//     if (!jsonString) {
//       throw new Error('No JSON data to upload');
//     }

//     // Get access token
//     const { accessToken } = await GoogleSignin.getTokens();
//     if (!accessToken) {
//       throw new Error('Failed to retrieve access token');
//     }

//     // Create FormData
//     const form = new FormData();
//     form.append('metadata', JSON.stringify({
//       name: 'sync-data.json',
//       mimeType: 'application/json',
//       parents: ['appDataFolder'],
//     }));

//     // Append file data (React Native doesn't reliably support Blob, so use object)
//     form.append('file', {
//       uri: Platform.OS === 'android' ? 'data:application/json;base64,' + Buffer.from(jsonString).toString('base64') : jsonString,
//       type: 'application/json',
//       name: 'sync-data.json',
//     });

//     // Make the API request
//     const response = await fetch(
//       'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'multipart/form-data', // Required for multipart upload
//         },
//         body: form,
//       }
//     );

//     // Check response status
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(`Google Drive API error: ${JSON.stringify(errorData, null, 2)}`);
//     }

//     const result = await response.json();
//     console.log('Upload successful:', result);

//     // Save last sync timestamp
//     const lastSyncTimestamp = new Date().toISOString();
//     console.log('Data uploaded to Google Drive successfully:', lastSyncTimestamp);
//     return result;

//   } catch (error) {
//     console.error('Error uploading to Google Drive:', JSON.stringify(error, null, 2));
//     throw error;
//   }
// };


// export const uploadToGoogleDrive = async () => {
//   try {
//     console.log("Uploading data to Google Drive...");

//     const jsonString = await exportDataToJson();
//     const token = await GoogleSignin.getTokens();

//     const metadata = {
//       name: "sync-data.json",
//       mimeType: "application/json",
//       parents: ["appDataFolder"],
//     };

//     const boundary = "foo_bar_baz";
//     const delimiter = `\r\n--${boundary}\r\n`;
//     const closeDelimiter = `\r\n--${boundary}--`;

//     const multipartRequestBody =
//       delimiter +
//       "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
//       JSON.stringify(metadata) +
//       delimiter +
//       "Content-Type: application/json\r\n\r\n" +
//       jsonString +
//       closeDelimiter;

//     const response = await fetch(
//       "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token.accessToken}`,
//           "Content-Type": `multipart/related; boundary=${boundary}`,
//         },
//         body: multipartRequestBody,
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Upload failed: ${errorText}`);
//     }

//     const responseData = await response.json();
//     console.log("✅ Upload successful. File ID:", responseData.id);

//     const lastSyncTimestamp = new Date().toISOString();
//     await AsyncStorage.setItem("lastSyncTimestamp", lastSyncTimestamp);
//   } catch (error) {
//     console.error("❌ Error uploading to Google Drive:", error);
//   }
// };

// export const downloadFromGoogleDrive = async () => {
//   try {
//     console.log("Downloading data from Google Drive...");

//     const token = await GoogleSignin.getTokens();

//     // Step 1: Find the file ID
//     const fileListResponse = await fetch(
//       "https://www.googleapis.com/drive/v3/files?q=name='sync-data.json'+and+'appDataFolder'+in+parents&spaces=appDataFolder&fields=files(id,name)",
//       {
//         headers: {
//           Authorization: `Bearer ${token.accessToken}`,
//         },
//       }
//     );

//     if (!fileListResponse.ok) {
//       const errorText = await fileListResponse.text();
//       throw new Error(`File list fetch failed: ${errorText}`);
//     }

//     const { files } = await fileListResponse.json();

//     if (!files || files.length === 0) {
//       console.log("No sync-data.json file found in Google Drive.");
//       return null;
//     }

//     const fileId = files[0].id;

//     // Step 2: Download the file content
//     const fileContentRes = await fetch(
//       `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
//       {
//         headers: {
//           Authorization: `Bearer ${token.accessToken}`,
//         },
//       }
//     );

//     if (!fileContentRes.ok) {
//       const errorText = await fileContentRes.text();
//       throw new Error(`File download failed: ${errorText}`);
//     }

//     const syncData = await fileContentRes.json();

//     if (!syncData) {
//       console.log("Downloaded sync data is empty.");
//       return;
//     }

//     await database.action(async () => {
//       console.log("Saving downloaded data to the database...");

//       const categoryCollection = database.collections.get("categories");
//       const subCategoryCollection = database.collections.get("subcategories");
//       const paymentModeCollection = database.collections.get("paymentModes");
//       const expenseCollection = database.collections.get("expenses");

//       for (const cat of syncData.categories) {
//         await categoryCollection.create((record) =>
//           Object.assign(record, cat)
//         );
//       }

//       for (const exp of syncData.expenses) {
//         await expenseCollection.create((record) =>
//           Object.assign(record, exp)
//         );
//       }
//     });

//     console.log("✅ Data downloaded and saved to the database successfully.");
//     await AsyncStorage.setItem(
//       "lastSyncTimestamp",
//       syncData.lastSyncTimestamp
//     );
//   } catch (error) {
//     console.error("❌ Error downloading from Google Drive:", error);
//   }
// };
