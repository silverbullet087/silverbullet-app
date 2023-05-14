import React, {useEffect, useState} from 'react';
import {Button, Input} from 'antd';
import {saveAs} from 'file-saver';
import {Typography} from 'antd';
import ThemedTitle from "../../common/components/ThemedTitle";

const {Title, Text} = Typography;

const SrtTranslationToolPage: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [translatedText, setTranslatedText] = useState<string>('');

    useEffect(() => {
        const textItem = sessionStorage.getItem('textItem');
        setTranslatedText(textItem || '');
    }, []);

    const handleSaveOriginalText = () => {
        sessionStorage.setItem('textItem', text);
    };

    const handleCopyTranslatedText = () => {
        navigator.clipboard.writeText(translatedText)
            .then(() => {
                console.log('텍스트가 클립보드에 복사되었습니다.');
            })
            .catch(err => {
                console.error('텍스트를 클립보드에 복사하는데 실패했습니다: ', err);
            });
    };

    const handleSrtDownload = () => {
        const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "translated.srt");
        sessionStorage.removeItem('textItem');
    };

    return (
        <div>
            <ThemedTitle title={'자막 번역 도구'}/>
            <Title level={2}>1. 현재 사이트 파파고 번역 실행</Title>
            <Text>
                현재 사이트 파파고 번역 실행한다.
            </Text>

            <Title level={2}>2. 자막 파일 내용 입력</Title>

            <Text>
                whisper-webui(음성 AI)를 활용해 영상의 텍스트를 추출한 자막 파일(확장자 srt)을 얼어서 복사해 붙여넣는다.
                내용을 넣고 원본 저장 버튼을 누른다.
            </Text>

            <Input.TextArea
                rows={10}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="원본 텍스트를 여기에 붙여넣으세요."
                style={{marginBottom: '10px', marginTop: '20px'}}
            />
            <Button onClick={handleSaveOriginalText}>원본 저장</Button>

            <Title level={2}>3. 현재 사이트를 새로고침</Title>
            <Text>
                자막 내용이 sessionStorage에 저장되어 있으니 새로고침하여 파파고로 번역한다
            </Text>

            <Title level={2}>4. 번역된 내용 복사</Title>
            <Text>
                자막에서 번역된 내용을 복사한다. 파파고 번역시 스크립트가 정상작동 안하기 때문에 복사해서 새 페이지에서 자막 파일을 다운 받는다.
            </Text>

            <div style={{marginTop: '10px'}}>
                <Button onClick={handleCopyTranslatedText}>번역 내용 복사</Button>
            </div>

            <Title level={2}>5. 자막다운</Title>
            <Text>
                복사된 내용을 파파고 번역 안된 새 페이지에서 붙여넣기로 입력하고, 자막 다운로드 버튼을 클릭하여 자막파일(*.srt)을 다운 받는다.
            </Text>
            <div style={{marginTop: '10px'}}>
                <Button onClick={handleSrtDownload}>자막 다운로드</Button>
            </div>


            <Text>{translatedText}</Text>
        </div>
    );
};

export default SrtTranslationToolPage;
