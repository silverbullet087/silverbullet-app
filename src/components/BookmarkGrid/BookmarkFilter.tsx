import React, {useState} from "react";
import {Button, Checkbox, Select} from "antd";

/**
 * Ant Design의 Select 컴포넌트에서 사용할 Option 객체를 추출합니다.
 */
const {Option} = Select;

/**
 * BookmarkFilter 컴포넌트의 속성들을 정의합니다.
 *
 * @param categories 북마크 카테고리들을 나타내는 문자열 배열입니다.
 * @param onFilter 카테고리 필터가 변경될 때 호출될 함수입니다. 선택된 카테고리들을 인자로 받습니다.
 * @param onSort 정렬 방식이 변경될 때 호출될 함수입니다. 선택된 정렬 키를 인자로 받습니다.
 * @param onReset 필터 및 정렬 설정이 초기화될 때 호출될 함수입니다.
 */
interface BookmarkFilterProps {
    categories: string[];
    onFilter: (selectedCategories: string[]) => void;
    onSort: (sortKey: string) => void;
    onReset: () => void;
}

/**
 * 북마크를 필터링하고 정렬하기 위한 컴포넌트입니다.
 */
const BookmarkFilter: React.FC<BookmarkFilterProps> = ({
                                                           categories,
                                                           onFilter,
                                                           onSort,
                                                           onReset,
                                                       }) => {
    // 선택된 카테고리들을 로컬 상태로 관리합니다.
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    /**
     * 카테고리 선택이 변경될 때 호출됩니다.
     * 로컬 상태를 업데이트하고, 부모 컴포넌트에게 변경 정보를 전달합니다.
     */
    const handleCategoryChange = (checkedValues: any) => {
        setSelectedCategories(checkedValues);
        onFilter(checkedValues);
    };

    /**
     * 정렬 방식이 변경될 때 호출됩니다. 변경된 정렬 키를 부모 컴포넌트에게 전달합니다.
     */
    const handleSortChange = (value: string) => {
        onSort(value);
    };

    /**
     * Reset 버튼 클릭 시 호출됩니다. 모든 선택을 제거하고, 부모 컴포넌트에게 초기화 신호를 보냅니다.
     */
    const handleReset = () => {
        setSelectedCategories([]);
        onReset();
    };


    // 북마크 필터 UI를 렌더링합니다.
    return (
        <div>
            {/* 정렬 방식 선택 UI를 정의합니다 */}
            <Select defaultValue="" onChange={handleSortChange} style={{marginRight: 8}}>
                <Option value="">Sort By</Option>
                <Option value="title">Title</Option>
                <Option value="category">Category</Option>
            </Select>
            {/* 카테고리 선택 UI를 정의하며,
                현재 선택된 카테고리를 표시하고, 선택 변경 시 handleCategoryChange 함수를 호출합니다. */}
            <Checkbox.Group
                options={categories}
                value={selectedCategories}
                onChange={handleCategoryChange}
            />
            {/* 초기화 버튼을 정의하며, 버튼 클릭 시 handleReset 함수를 호출합니다. */}
            <Button type="primary" onClick={handleReset} style={{marginLeft: 8}}>
                Reset
            </Button>
        </div>
    );
};

/**
 * 이후의 컴포넌트 재사용을 위해, BookmarkFilter 컴포넌트를 export 합니다.
 */
export default BookmarkFilter;