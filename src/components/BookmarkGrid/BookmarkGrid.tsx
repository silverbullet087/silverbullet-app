import React from "react";
import Masonry from "react-masonry-css";
import "./BookmarkGrid.scss";
import {Card, Dropdown, MenuProps, Tooltip} from "antd";
import {EllipsisOutlined, PlusOutlined,} from "@ant-design/icons";

// Bookmark interface
interface Bookmark {
    id: number | null;
    title: string;
    url: string;
    favicon: string;
    category: string;
}

// BookmarkGridProps
interface BookmarkGridProps {
    bookmarks: Bookmark[];
    onAddBookmark: () => void;
    onUpdateBookmark: (bookmark: Bookmark) => void;
    onDeleteBookmark: (id: number) => void;
}

// BookmarkGrid component
const BookmarkGrid: React.FC<BookmarkGridProps> = ({
                                                       bookmarks,
                                                       onAddBookmark,
                                                       onUpdateBookmark,
                                                       onDeleteBookmark,
                                                   }) => {
    const breakpointColumnsObj = {
        default: 6,
        1100: 5,
        700: 3,
        500: 2,
    };

    // renderBookmarks
    const renderBookmarks = () => {
        return [
            ...bookmarks.map((bookmark) => {
                const items: MenuProps["items"] = [
                    {
                        key: "1",
                        label: (
                            <button
                                className="link-button"
                                onClick={() => onUpdateBookmark(bookmark)}
                            >
                                수정
                            </button>
                        ),
                    },
                    {
                        key: "2",
                        label: (
                            <button
                                className="link-button"
                                onClick={() => onDeleteBookmark(bookmark?.id ?? 0)}
                            >
                                삭제
                            </button>
                        ),
                    },
                ];

                const handleImgError = (e: any) => {
                    e.target.src = './no-image-icon-23485.png';
                }

                function TooltipWrapper(content: string) {
                    return (
                        <Tooltip placement="topRight" title={content} arrow>
                            {content}
                        </Tooltip>
                    )
                }

                return (
                    <>
                        <Card
                            key={bookmark.id}
                            size="small"
                            title={TooltipWrapper(bookmark.title)}
                            extra={
                                <>
                                    <Dropdown menu={{items}}>
                                        <EllipsisOutlined/>
                                    </Dropdown>
                                </>
                            }
                            style={{
                                width: "100%",
                                marginBottom: 16,
                            }}
                        >
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <a href={bookmark.url} target="_blank">
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <img src={bookmark.favicon} alt="favicon" width={'30px'}
                                             onError={handleImgError}/>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <p>{bookmark.category}</p>
                                    </div>
                                </a>
                            </div>
                        </Card>
                    </>
                );
            }),
            <Card
                key="add"
                size="small"
                style={{
                    width: "100%",
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "147px",
                }}
                onClick={onAddBookmark}
            >
                <PlusOutlined/>
            </Card>,
        ];
    };

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            {renderBookmarks()}
        </Masonry>
    );
};

export default BookmarkGrid;
