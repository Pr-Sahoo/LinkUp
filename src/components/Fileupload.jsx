import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';



const Fileupload = ({ onFileUpload }) => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        if(e.target.files[0]) {
        setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) return;

        setUploading(true);
        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //Progress indicator
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error("Upload Error: ", error);
            },
            async () => {
                // get file url after file upload
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                onFileUpload(downloadUrl, file.type, file.name);
                setFile(null);
                setProgress(0);
            }
        );
    };
    return (
    // <div>
    //     <input type="file" onChange={handleFileChange} />
    //     <button onClick={handleUpload}>Upload</button>
    //     {progress > 0 && <p>Uploading: {progress.toFixed(2)}%</p>}
    // </div>
    <div className='mt-2'>
        <div className="flex items-center space-x-2">
            <input type="file" onChange={handleFileChange} className='hidden' id='fileInput' disabled={uploading} />
            <label htmlFor="fileInput" className='bg-blue-500 text-black px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600'>Choose file</label>
            {file && (
                <span className='text-sm text-gray-700'>{file.name}</span>
            )}
            <button className='bg-green-500 px-4 py-2 text-white rounded-lg hover:bg-green-600 disabled:opacity-50' onClick={handleUpload} disabled={uploading || !file}>{uploading ? "uploading..." : "upload"}</button>
        </div>
        {progress > 0 && (
            <div className='w-full bg-gray-200 rounded-full h-2.5 mt-2'>
                <div className='bg-blue-600 h-2.5 rounded-full' style={{width: `${progress}%`}}></div>
            </div>
        )}
    </div>
  );
};

export default Fileupload;