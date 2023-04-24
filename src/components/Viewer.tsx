import React, { useState } from "react";
import { Image, Row, Col, Drawer, Button, Upload, message } from "antd";
import JSZip from "jszip";

interface ImageViewerProps {
  images?: string[];
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images: initialImages = [],
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fileList, setFileList] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>(initialImages);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const handleUpload = async (file: File) => {
    const jsZip = new JSZip();
    try {
      const zipContent = await jsZip.loadAsync(file);
      const imageFiles = Object.values(zipContent.files).filter((file) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
      );

      const newImages = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const blob = await file.async("blob");
        const url = URL.createObjectURL(blob);

        newImages.push(url);
      }

      if (newImages.length > 0) {
        setCurrentIndex(0);
        setVisible(true);
        setImages(newImages);
      } else {
        message.error("The zip file does not contain any valid image files.");
      }
    } catch (error) {
      console.error("Error reading zip file:", error);
      message.error("Failed to read the zip file.");
    }

    return false;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const { clientX } = e;
      const { innerWidth } = window;
      if (clientX < innerWidth / 2) {
        prevImage();
      } else {
        nextImage();
      }
    } else {
      onClose();
    }
  };

  return (
    <>
      <Upload.Dragger
        accept=".zip"
        customRequest={({ file }) => handleUpload(file as File)}
        showUploadList={false}
        fileList={fileList}
      >
        <p className="ant-upload-drag-icon">
          <i className="fas fa-file-archive" />
        </p>
        <p className="ant-upload-text">
          업로드할 파일을 클릭하거나 이 영역으로 드래그하세요.
        </p>
      </Upload.Dragger>
      {images.length > 0 && (
        <>
          <div
            onClick={handleClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              position: "relative",
            }}
          >
            <Image
              src={images[currentIndex]}
              style={{ maxHeight: "100%", maxWidth: "100%" }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ImageViewer;
