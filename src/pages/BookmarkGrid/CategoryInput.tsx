import React, {useRef, useState} from 'react';
import {Button, Divider, Input, InputRef, Select, Space} from 'antd';
import {PlusOutlined} from "@ant-design/icons";

const {Option} = Select;

interface CategoryInputProps {
    initCategories: string[];
    form: any;
}

let index = 0;

const CategoryInput: React.FC<CategoryInputProps> = ({initCategories, form}) => {
    const [categories, setCategories] = useState(initCategories);
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setCategories([...categories, name || `카테고리 ${index++}`]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleCategoryChange = (value: any) => {
        form.setFieldsValue({category: value});
    }

    return (
        <Select
            placeholder="카테고리를 입력해 주세요."
            // mode="tags"
            style={{width: '100%'}}
            onChange={handleCategoryChange}
            value={form.getFieldValue('category')}

            dropdownRender={(menu) => (
                <>
                    {menu}
                    <Divider style={{margin: '8px 0'}}/>
                    <Space style={{padding: '0 8px 4px'}}>
                        <Input
                            placeholder="카테고리를 입력하세요."
                            ref={inputRef}
                            value={name}
                            onChange={onNameChange}
                        />
                        <Button type="text" icon={<PlusOutlined/>} onClick={addItem}>
                            카테고리를 추가하세요.
                        </Button>
                    </Space>
                </>
            )}
            options={categories.map((category) => ({label: category, value: category}))}
        />
    );
}

export default CategoryInput;
