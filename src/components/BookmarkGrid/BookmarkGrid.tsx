import React from "react";
import Masonry from "react-masonry-css";
import "./BookmarkGrid.css";
import { Card, Menu, Dropdown, MenuProps } from "antd";
import {
  CaretDownOutlined,
  PlusOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

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
    default: 5,
    1100: 4,
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
                Edit
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
                Delete
              </button>
            ),
          },
        ];

        return (
          <>
            <Card
              key={bookmark.id}
              size="small"
              title={bookmark.title}
              extra={
                <>
                  <a href={bookmark.url}>Go</a>
                  <Dropdown menu={{ items }}>
                    <EllipsisOutlined />
                  </Dropdown>
                </>
              }
              style={{
                width: "100%",
                marginBottom: 16,
              }}
            >
              <img src={bookmark.favicon} alt="favicon" />
              <p>{bookmark.category}</p>
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
        }}
        onClick={onAddBookmark}
      >
        <PlusOutlined />
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
