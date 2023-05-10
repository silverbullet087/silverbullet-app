import React from 'react';
import {theme, Typography} from 'antd';

const {Title} = Typography;

interface ThemedTitleProps {
    title: string;
}

const ThemedTitle: React.FC<ThemedTitleProps> = ({title}) => {
    const {useToken} = theme;
    const {token} = useToken();

    return (
        <Title style={{color: token.colorPrimary}}>
            {title}
        </Title>
    );
};

export default ThemedTitle;
