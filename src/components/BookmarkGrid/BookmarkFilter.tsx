import React, { useState } from "react";
import { Button, Checkbox, Select } from "antd";

const { Option } = Select;

interface BookmarkFilterProps {
  categories: string[];
  onFilter: (selectedCategories: string[]) => void;
  onSort: (sortKey: string) => void;
  onReset: () => void;
}

const BookmarkFilter: React.FC<BookmarkFilterProps> = ({
  categories,
  onFilter,
  onSort,
  onReset,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (checkedValues: any) => {
    setSelectedCategories(checkedValues);
    onFilter(checkedValues);
  };

  const handleSortChange = (value: string) => {
    onSort(value);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    onReset();
  };

  return (
    <div>
      <Select defaultValue="" onChange={handleSortChange} style={{ marginRight: 8 }}>
        <Option value="">Sort By</Option>
        <Option value="title">Title</Option>
        <Option value="category">Category</Option>
      </Select>
      <Checkbox.Group
        options={categories}
        value={selectedCategories}
        onChange={handleCategoryChange}
      />
      <Button type="primary" onClick={handleReset} style={{ marginLeft: 8 }}>
        Reset
      </Button>
    </div>
  );
};

export default BookmarkFilter;
