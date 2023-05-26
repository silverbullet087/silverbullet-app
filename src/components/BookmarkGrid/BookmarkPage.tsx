import React, {useMemo, useState} from "react";
import BookmarkGrid from "./BookmarkGrid";
import {Button, Checkbox, Space,} from "antd";
import type {CheckboxValueType} from "antd/lib/checkbox/Group";
import {DownOutlined, DownloadOutlined, UpOutlined} from "@ant-design/icons";
import type {Bookmark} from "../Common/Constants";
import {ModalStatus} from "../Common/Constants";
import BookmarkSaveModal from "./BookmarkSaveModal";
import ThemedTitle from "../../common/components/ThemedTitle";
import BookmarkUploadButton from "./BookmarkUploadButton";

// 초기 설정 북마크 리스트 데이터 하드코딩 (추후 수정 예정)
const bookmarkList: Bookmark[] = [
    // 검색
    {
        id: 1,
        title: "Google",
        url: "https://www.google.com",
        favicon: "https://www.google.com/favicon.ico",
        category: "검색",
    },
    {
        id: 2,
        title: "Naver",
        url: "https://www.naver.com/",
        favicon: "https://www.naver.com/favicon.ico",
        category: "검색",
    },
    {
        id: 3,
        title: "Daum",
        url: "https://www.daum.net/",
        favicon: "https://www.daum.net/favicon.ico",
        category: "검색",
    },
    {
        id: 4,
        title: "bing",
        url: "https://www.bing.com/",
        favicon: "https://www.bing.com/favicon.ico",
        category: "검색",
    },
    // 동영상
    {
        id: 10,
        title: "Youtube",
        url: "https://www.youtube.com/",
        favicon: "https://www.youtube.com/favicon.ico",
        category: "동영상",
    },
    {
        id: 11,
        title: "NETFLIX",
        url: "https://www.netflix.com/kr/",
        favicon: "https://www.netflix.com/kr/favicon.ico",
        category: "동영상",
    },
    // 개발
    {
        id: 100,
        title: "w3schools",
        url: "https://www.w3schools.com/",
        favicon: "https://www.w3schools.com/favicon.ico",
        category: "개발",
    },
    {
        id: 101,
        title: "jquery",
        url: "https://jquery.com/",
        favicon: "https://jquery.com/favicon.ico",
        category: "개발",
    },
    {
        id: 102,
        title: "github",
        url: "https://github.com/",
        favicon: "https://github.com/favicon.ico",
        category: "개발",
    },
    {
        id: 103,
        title: "Stack Overflow",
        url: "https://stackoverflow.com",
        favicon: "https://stackoverflow.com/favicon.ico",
        category: "개발",
    },
    {
        id: 104,
        title: "Angular",
        url: "https://angular.io/",
        favicon: "https://angular.io/assets/images/favicons/favicon.ico",
        category: "개발",
    },
    {
        id: 105,
        title: "React",
        url: "https://reactjs.org/",
        favicon: "https://reactjs.org/favicon.ico",
        category: "개발",
    },
    {
        id: 106,
        title: "Vue",
        url: "https://vuejs.org/",
        favicon: "https://vuejs.org/logo.svg",
        category: "개발",
    },
    {
        id: 107,
        title: "Anguler Material UI",
        url: "https://material.angular.io/",
        favicon: "https://material.angular.io/favicon.ico",
        category: "개발",
    },
    {
        id: 107,
        title: "React Material UI",
        url: "https://mui.com/material-ui/react-masonry/",
        favicon: "https://material-ui.com/favicon.ico",
        category: "개발",
    },
    {
        id: 108,
        title: "React Ant Design",
        url: "https://ant.design/",
        favicon: "https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png",
        category: "개발",
    },
    {
        id: 109,
        title: "Netlify",
        url: "https://app.netlify.com/",
        favicon: "https://app.netlify.com/favicon.ico",
        category: "개발",
    },
    // AI
    {
        id: 200,
        title: "chatgpt",
        url: "https://openai.com/blog/chatgpt/",
        favicon: "https://chat.openai.com/favicon-32x32.png",
        category: "AI",
    },
    {
        id: 201,
        title: "openai",
        url: "https://openai.com/",
        favicon: "https://openai.com/favicon.ico",
        category: "AI",
    },
    {
        id: 202,
        title: "gamma",
        url: "https://gamma.dev/",
        favicon: "https://gamma.app/favicons/favicon-transparent-96x96.png",
        category: "AI",
    },
    {
        id: 203,
        title: "microsoft designer",
        url: "https://designer.microsoft.com/",
        favicon: "https://designer.microsoft.com/favicon-32.png",
        category: "AI",
    },
    {
        id: 205,
        title: "huggingface",
        url: "https://huggingface.co/",
        favicon: "https://huggingface.co/favicon.ico",
        category: "AI",
    },
    {
        id: 206,
        title: "google keep",
        url: "https://keep.google.com/u/0/#label/AI",
        favicon: "https://ssl.gstatic.com/keep/icon_2020q4v2_128.png",
        category: "AI",
    },
    // 번역
    {
        id: 300,
        title: "Google Translate",
        url: "https://translate.google.com/",
        favicon: "https://translate.google.com/favicon.ico",
        category: "번역",
    },
    {
        id: 301,
        title: "Papago",
        url: "https://papago.naver.com/",
        favicon: "https://papago.naver.com/favicon.ico",
        category: "번역",
    },
    {
        id: 302,
        title: "DeepL",
        url: "https://www.deepl.com/translator",
        favicon: "https://static.deepl.com/img/favicon/favicon_32.png",
        category: "번역",
    },
    {
        id: 303,
        title: "Bing Translator",
        url: "https://www.bing.com/translator",
        favicon: "https://www.bing.com/favicon.ico",
        category: "번역",
    },
    {
        id: 304,
        title: "Kakao Translate",
        url: "https://translate.kakao.com/",
        favicon: "https://translate.kakao.com/favicon.ico",
        category: "번역",
    },
    // 생산성
    {
        id: 400,
        title: "Google Calendar",
        url: "https://calendar.google.com/",
        favicon: "https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_8.ico",
        category: "생산성",
    },
    {
        id: 403,
        title: "Google Drive",
        url: "https://drive.google.com/",
        favicon: "https://drive.google.com/favicon.ico",
        category: "생산성",
    },
    {
        id: 404,
        title: "Notion",
        url: "https://www.notion.so/",
        favicon: "https://www.notion.so/images/favicon.ico",
        category: "생산성",
    },
    {
        id: 405,
        title: "icloud",
        url: "https://www.icloud.com/",
        favicon: "https://www.icloud.com/favicon.ico",
        category: "생산성",
    },
    // 자기개발
    /*
    {
        id: 500,
        title: "실버블렛 Insights",
        url: "https://silverbullet.tistory.com/",
        favicon: "https://silverbullet.tistory.com/favicon.ico",
        category: "자기개발",
    },
    {
        id: 501,
        title: "실버블렛 Naver Blog",
        url: "https://blog.naver.com/grinby21",
        favicon: "https://blog.naver.com/favicon.ico?3",
        category: "자기개발",
    },기
    */
    {
        id: 502,
        title: "공부블로그(Notion)",
        url: "https://pewter-vase-e10.notion.site/c2fafd8f213645a0a08cf335f7045f44",
        favicon: "https://www.notion.so/images/favicon.ico",
        category: "자기개발",
    },
    // 토이 프로젝트
    {
        id: 600,
        title: "실버블렛스톡",
        url: "https://silverbulletstock.com/",
        favicon: "https://silverbulletstock.netlify.app/assets/icons/ms-icon-144x144.png",
        category: "토이 프로젝트",
    },
    {
        id: 601,
        title: "DevLifeBoost",
        url: "https://devlifeboost.netlify.app/",
        favicon: "https://devlifeboost.netlify.app/favicon.ico",
        category: "토이 프로젝트",
    },
    {
        id: 602,
        title: "Sample Test HTML",
        url: "https://sampletesthtml.netlify.app/",
        favicon: "https://sampletesthtml.netlify.app/favicon.ico",
        category: "토이 프로젝트",
    },
    // 주식
    {
        id: 701,
        title: "Yahoo Finance",
        url: "https://finance.yahoo.com/",
        favicon: "https://finance.yahoo.com/favicon.ico",
        category: "주식",
    },
    {
        id: 702,
        title: "investing.com",
        url: "https://www.investing.com/",
        favicon: "https://www.investing.com/favicon.ico",
        category: "주식",
    },
    {
        id: 703,
        title: "Nasdaq",
        url: "https://www.nasdaq.com/",
        favicon: "https://www.nasdaq.com/favicon.ico",
        category: "주식",
    },
    {
        id: 704,
        title: "Finviz",
        url: "https://finviz.com/",
        favicon: "https://finviz.com/favicon.ico",
        category: "주식",
    },
    {
        id: 705,
        title: "portfoliovisualizer.com",
        url: "https://www.portfoliovisualizer.com/backtest-portfolio#analysisResults",
        favicon: "https://www.portfoliovisualizer.com/favicon.ico",
        category: "주식",
    },
    // 취미
    {
        id: 800,
        title: "anilife",
        url: "https://anilife.live/",
        favicon: "https://anilife.live/img/icons//favicon-144x144.png",
        category: "취미",
    },
    {
        id: 801,
        title: "만화토끼",
        url: "https://t.me/s/newtoki5",
        favicon: "https://telegram.org/img/favicon.ico",
        category: "취미",
    },
    // 디자인
    {
        id: 900,
        title: "dribbble",
        url: "https://dribbble.com/",
        favicon: "https://cdn.dribbble.com/assets/favicon-b38525134603b9513174ec887944bde1a869eb6cd414f4d640ee48ab2a15a26b.ico",
        category: "디자인",
    },
    {
        id: 901,
        title: "TypeIt",
        url: "https://www.typeitjs.com/",
        favicon: "https://www.typeitjs.com/favicon-32x32.png?v=f1d753dd1ac636c44873ee19264ce4a8",
        category: "디자인",
    },
    {
        id: 902,
        title: "ScrollOut",
        url: "https://scroll-out.github.io/",
        favicon: "https://scroll-out.github.io/favicon.ico",
        category: "디자인",
    },
    {
        id: 903,
        title: "animejs",
        url: "https://animejs.com/",
        favicon: "https://animejs.com/documentation/assets/img/favicon.png",
        category: "디자인",
    },
    {
        id: 904,
        title: "rellaxjs",
        url: "https://yaireo.github.io/rellax/",
        favicon: "https://yaireo.github.io/rellax/favicon.png",
        category: "디자인",
    },
    {
        id: 904,
        title: "GreenSock",
        url: "https://greensock.com/",
        favicon: "https://greensock.com/uploads/monthly_2018_06/favicon.ico.4811a987b377f271db584b422f58e5a7.ico",
        category: "디자인",
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

    const onBookmarkLocalStorageDeleteButtonClick = () => {
        localStorage.setItem("bookmarks", JSON.stringify([]));
        setBookmarks([]);
    }

    // 북마크 초기값으로 초기화 버튼 이벤트
    const onBookmarkLocalStorageInitButtonClick = () => {
        localStorage.setItem("bookmarks", JSON.stringify(bookmarkList));
        setBookmarks(bookmarkList);
    }

    // 북마크 다운로드
    const onBookmarkDownload = () => {
        const data = localStorage.getItem('bookmarks');
        if (data) {
            const jsonData = JSON.stringify(JSON.parse(data), null, 2);
            const blob = new Blob([jsonData], {type: "application/json"});
            const url = URL.createObjectURL(blob);

            // 가상의 <a> 태그를 생성하고 클릭 이벤트를 발생시킵니다.
            const link = document.createElement('a');
            link.href = url;
            link.download = 'bookmark.json'; // 원하는 파일명을 설정합니다.
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

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
        <div className="bookmark-upload-container">
            <ThemedTitle title={'북마크'}/>
            <Space
                className="controlPanel"
                direction="vertical"
                style={{marginBottom: 16}}
            >
                <Space className="button-group-container">
                    <Button
                        type={sortKey === "title" ? "primary" : "default"}
                        onClick={() => onSortButtonClick("title")}
                    >
                        <span>사이트명순</span>
                        {sortOrder === "asc" && sortKey === "title" ? <UpOutlined/> : <DownOutlined/>}
                    </Button>
                    <Button
                        type={sortKey === "category" ? "primary" : "default"}
                        onClick={() => onSortButtonClick("category")}
                    >
                        <span>카테고리순</span>
                        {sortOrder === "asc" && sortKey === "category" ? <UpOutlined/> : <DownOutlined/>}
                    </Button>
                    <Button
                        className="hide-on-mobile"
                        onClick={() => onBookmarkLocalStorageInitButtonClick()}
                    >
                        <span>초기화</span>
                    </Button>
                    <Button
                        className="hide-on-mobile"
                        onClick={() => onBookmarkLocalStorageDeleteButtonClick()}
                    >
                        <span>전체 삭제</span>
                    </Button>
                    <Button
                        className="hide-on-mobile"
                        onClick={() => onBookmarkDownload()}
                        icon={<DownloadOutlined />}
                    >
                        <span>북마크 다운로드</span>
                    </Button>
                    <BookmarkUploadButton className="hide-on-mobile" setBookmarks={setBookmarks}/>
                </Space>
                <Checkbox.Group
                    className="checkbox-group-container"
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
                categories={categories}
                setBookmarks={setBookmarks}
                setModalStatus={setModalStatus}
            />
        </div>
    );
};

export default BookmarkPage;
