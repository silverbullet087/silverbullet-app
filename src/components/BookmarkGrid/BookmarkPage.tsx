import React, { useState, useMemo, useEffect } from "react";
import BookmarkGrid from "./BookmarkGrid";
import {
  Button,
  Checkbox,
  Space,
  Modal,
  Form,
  Input,
  Dropdown,
  Menu,
  Radio,
} from "antd";
import type { CheckboxValueType } from "antd/lib/checkbox/Group";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import {
  CaretDownOutlined,
  PlusOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { ModalStatus } from "../Common/Constants";
import type { Bookmark } from "../Common/Constants";
import BookmarkSaveModal from "./BookmarkSaveModal";

// 초기 설정 북마크 리스트 데이터 하드코딩 (추후 수정 예정)
const bookmarkList: Bookmark[] = [
  {
    id: 1,
    title: "Google",
    url: "https://www.google.com",
    favicon: "https://www.google.com/favicon.ico",
    category: "검색",
  },
  {
    id: 2,
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    favicon: "https://stackoverflow.com/favicon.ico",
    category: "Development",
  },
  {
    id: 3,
    title: "Naver1",
    url: "https://www.naver.com/",
    favicon: "https://www.naver.com/favicon.ico",
    category: "type2",
  },
  {
    id: 4,
    title: "Naver2",
    url: "https://www.naver.com/",
    favicon: "https://www.naver.com/favicon.ico",
    category: "type3",
  },
  {
    id: 5,
    title: "Naver3",
    url: "https://www.naver.com/",
    favicon: "https://www.naver.com/favicon.ico",
    category: "type4",
  },
];


/**
 * 북마크 페이지 컴포넌트
 * @returns 
 */
const BookmarkPage: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<
    CheckboxValueType[]
  >([]);
  const [sortKey, setSortKey] = useState<"title" | "category" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  // localStorage 값이 있으면 가져오고 없으면 초기값으로 설정
  const initialBookmarks = localStorage.getItem("bookmarks")
    ? JSON.parse(localStorage.getItem("bookmarks") as string)
    : bookmarkList;

  // 현재 북마크 리스트 상태 관리
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  // 모달창 상태 관리
  const [modalStatus, setModalStatus] = useState(ModalStatus.CLOSE);
  // 모달창에서 선택된 북마크 정보 관리
  const [currentBookmark, setCurrentBookmark] = useState<Bookmark | null>(null);
  // 모달창 열린지 여부 (true: 열림, false: 닫힘)
  const isModalOpen = modalStatus !== ModalStatus.CLOSE;

  // 체크박스 카테고리 선택 시 필터링
  const onCategoryChange = (checkedValues: CheckboxValueType[]) => {
    setSelectedCategories(checkedValues);
  };

  // 정렬 버튼 클릭 시(같은 정렬 버튼 클릭시 정렬순서 변경, 다른 정렬 버튼 클릭시 정렬키 변경/내림차순으로 변경)
  const onSortButtonClick = (key: "title" | "category") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // 카테고리 목록 생성 (중복 제거) 체크박스에 사용
  const categories = useMemo(() => {
    return Array.from(
      new Set(bookmarks.map((bookmark: Bookmark) => bookmark.category))
    );
  }, [bookmarks]);

  // 북마크 추가를 위해 모달창 열기
  const onAddBookmark = () => {
    setCurrentBookmark(null);
    setModalStatus(ModalStatus.CREATE);
  };

  // 북마크 수정을 위해 모달창 열기
  const onUpdateBookmark = (bookmark: Bookmark) => {
    setCurrentBookmark(bookmark);
    setModalStatus(ModalStatus.UPDATE);
  };

  // 북마크 삭제
  const onDeleteBookmark = (id: number) => {
    const updatedBookmarks = bookmarks.filter(
      (bookmark: Bookmark) => bookmark.id !== id
    );
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
  };

  // 카테고리 체크박스 선택 필터링, 정렬 적용한 북마크 리스트
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks.filter((bookmark: Bookmark) =>
      selectedCategories.length === 0
        ? true
        : selectedCategories.includes(bookmark.category)
    );

    if (sortKey) {
      filtered.sort((a: Bookmark, b: Bookmark) => {
        if (sortOrder === "asc") {
          return a[sortKey].localeCompare(b[sortKey]);
        } else {
          return b[sortKey].localeCompare(a[sortKey]);
        }
      });
    }

    return filtered;
  }, [bookmarks, selectedCategories, sortKey, sortOrder]);

  return (
    <>
      <Space
        className="controlPanel"
        direction="vertical"
        style={{ marginBottom: 16 }}
      >
        <Space>
          <Button
            type={sortKey === "title" ? "primary" : "default"}
            onClick={() => onSortButtonClick("title")}
          >
            <span>Title</span>
            {sortOrder === "asc" ? <UpOutlined /> : <DownOutlined />}
          </Button>
          <Button
            type={sortKey === "category" ? "primary" : "default"}
            onClick={() => onSortButtonClick("category")}
          >
            <span>Category</span>
            {sortOrder === "asc" ? <UpOutlined /> : <DownOutlined />}
          </Button>
        </Space>
        <Checkbox.Group
          options={categories}
          value={selectedCategories}
          onChange={onCategoryChange}
        />
      </Space>
      <BookmarkGrid
        bookmarks={filteredBookmarks}
        onAddBookmark={onAddBookmark}
        onUpdateBookmark={onUpdateBookmark}
        onDeleteBookmark={onDeleteBookmark}
      />
      <BookmarkSaveModal
        currentBookmark={currentBookmark}
        bookmarks={bookmarks}
        modalStatus={modalStatus}
        onAddBookmark={onAddBookmark}
        onUpdateBookmark={onUpdateBookmark}
        onDeleteBookmark={onDeleteBookmark}
        setBookmarks={setBookmarks}
        setModalStatus={setModalStatus}
      />
    </>
  );
};

export default BookmarkPage;
