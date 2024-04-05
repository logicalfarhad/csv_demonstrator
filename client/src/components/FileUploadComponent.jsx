// FileUploadComponent.js
import React from "react";
import { useDropzone } from 'react-dropzone';
import { PlusCircle } from 'react-bootstrap-icons';

const FileUploadComponent = ({ onFileDrop, t }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv']
    },
    onDrop: onFileDrop,
  });

  return (
    <div {...getRootProps()} style={dropzoneStyles}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the CSV file(s) here...</p>
      ) : (
        <>
          <PlusCircle style={{ fontSize: "45px" }} />
          <p>{t("menu2_dropzone_msg")}</p>
        </>
      )}
    </div>
  );
};

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default FileUploadComponent;
