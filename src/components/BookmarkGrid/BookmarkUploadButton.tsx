import React from 'react';
import {UploadOutlined} from '@ant-design/icons';
import {Button, message, Upload} from 'antd';
import {RcFile} from "antd/es/upload";
import {Bookmark} from "../Common/Constants";

interface BookmarkUploadButtonProps {
    setBookmarks: (bookmarkList: Bookmark[]) => void;
    className: string;
}

const BookmarkUploadButton: React.FC<BookmarkUploadButtonProps> = ({setBookmarks, className}) => {
    const beforeUpload = (file: RcFile) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const bookmarkList = JSON.parse(e.target?.result as string);
                localStorage.setItem("bookmarks", JSON.stringify(bookmarkList));
                setBookmarks(bookmarkList);
                message.success('Data uploaded successfully!');
            } catch (error) {
                message.error('Error: Invalid JSON.');
            }
        };

        reader.readAsText(file);

        // Prevent upload
        return false;
    }

    return (
        <Upload beforeUpload={beforeUpload} accept=".json" showUploadList={false}>
            <Button className={className} icon={<UploadOutlined/>}>북마크 업로드</Button>
        </Upload>
    );

};

export default BookmarkUploadButton;
