import React, {useCallback, useEffect, useState} from "react";
import {Modal, Form, Input, message, FormInstance} from "antd";
import {Bookmark, ModalStatus} from "../Common/Constants";

interface BookmarkSaveModalProps {
    currentBookmark: Bookmark | null;
    bookmarks: Bookmark[];
    modalStatus: ModalStatus;
    onAddBookmark: () => void;
    onUpdateBookmark: (bookmark: Bookmark) => void;
    onDeleteBookmark: (id: number) => void;
    setBookmarks: (bookmarks: Bookmark[]) => void;
    setModalStatus: (modalStatus: ModalStatus) => void;
}

const BookmarkSaveModal: React.FC<BookmarkSaveModalProps> = ({
                                                                 currentBookmark,
                                                                 bookmarks,
                                                                 modalStatus,
                                                                 onAddBookmark,
                                                                 onUpdateBookmark,
                                                                 onDeleteBookmark,
                                                                 setBookmarks,
                                                                 setModalStatus,
                                                             }) => {
    // Form 데이터 초기값 설정
    const [form] = Form.useForm();
    let resultBookmarkList: Bookmark[] = [];

    // 북마크 초기값 설정
    let initialFormValues: Bookmark = {
        id: null,
        title: "",
        url: "",
        favicon: "",
        category: "",
    };

    // 수정시 모달창에 기존 북마크 정보 표시
    if (modalStatus === ModalStatus.UPDATE) {
        initialFormValues = {
            id: currentBookmark?.id ?? 0,
            title: currentBookmark?.title ?? "",
            url: currentBookmark?.url ?? "",
            favicon: currentBookmark?.favicon ?? "",
            category: currentBookmark?.category ?? "",
        };
    }

    // form 초기값 설정
    form.setFieldsValue(initialFormValues);

    /**
     * 모달창에서 입력한 북마크 정보를 통해 북마크 추가 및 수정
     */
    const handleModalOk = () => {
        let updatedBookmark = form.getFieldsValue();

        // 예제
        checkValidation(form).then(isValid => {
            if (isValid) {
                // 유효하면 작업 수행
                handleBookmarkSave(updatedBookmark);
            } else {
                // 유효하지 않으면 에러 처리
                return;
            }
        });
    };

    // 모달 validation 체크
    const checkValidation = (form: FormInstance): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            form.validateFields()
                .then(() => {
                    resolve(true);
                })
                .catch((errorInfo: any) => {
                    const isValid = errorInfo.errorFields.length === 0;
                    resolve(isValid);
                });
        });
    }


    // 북마크 등록/수정 처리
    const handleBookmarkSave = (updatedBookmark: any) => {
        // 북마크 추가
        if (modalStatus === ModalStatus.CREATE) {
            const newBookmark: Bookmark = {
                id:
                    Math.max(
                        ...bookmarks.map(
                            (bookmark: Bookmark) => bookmark.id ?? bookmarks.length
                        )
                    ) + 1,
                title: updatedBookmark?.title || "",
                url: updatedBookmark?.url || "",
                favicon: updatedBookmark?.favicon || "",
                category: updatedBookmark?.category || "",
            };
            resultBookmarkList = [...bookmarks, newBookmark];
        }

        // 북마크 수정
        if (modalStatus === ModalStatus.UPDATE) {

            resultBookmarkList = bookmarks.map((bookmark: Bookmark) => {
                if (bookmark.id === updatedBookmark?.id) {
                    return {
                        ...bookmark,
                        title: updatedBookmark.title,
                        url: updatedBookmark.url,
                        favicon: updatedBookmark.favicon,
                        category: updatedBookmark.category,
                    };
                }
                return bookmark;
            });
        }

        // 북마스크 추가 및 수정
        localStorage.setItem("bookmarks", JSON.stringify(resultBookmarkList));
        setBookmarks(resultBookmarkList);

        // 모달 닫기
        setModalStatus(ModalStatus.CLOSE);

        // form 초기화
        form.resetFields();
    };

    // 모달창 닫기
    const handleModalCancel = () => {
        setModalStatus(ModalStatus.CLOSE);
    };

    // 성공 메시지
    const onFinish = () => {
        message.success("Submit success!");
    };

    // 실패 메시지
    const onFinishFailed = () => {
        message.error("Submit failed!");
    };

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        form.setFieldsValue({...form, [name]: value});
    };

    return (
        <Modal
            title={
                modalStatus === ModalStatus.UPDATE ? "북마크 수정" : "북마크 추가"
            }
            open={ModalStatus.CLOSE !== modalStatus}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            okText="등록"
            cancelText="취소"
        >
            <Form
                form={form}
                name="bookmark_form"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{form}}
                layout="vertical"
            >
                <Form.Item name="id" style={{display: "none"}}>
                    <Input type="hidden"/>
                </Form.Item>
                <Form.Item
                    name="title"
                    label="사이트명"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: "필수값 입니다.",
                        },
                        {
                            type: "string",
                            max: 50,
                            message: "사이트명은 50자 이내로 입력해 주세요.",
                        },
                    ]}
                >
                    <Input
                        name={"title"}
                        placeholder="사이트명을 입력해 주세요."
                        onChange={(e: any) => handleChange(e)}
                    />
                </Form.Item>
                <Form.Item
                    name="url"
                    label="URL"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: "필수값 입니다.",
                        },
                        {
                            type: "url",
                            message: "url 형식이 잘못 되었습니다.",
                        },
                    ]}
                >
                    <Input
                        name={"url"}
                        placeholder="url을 입력해 주세요."
                        onChange={(e: any) => handleChange(e)}
                    />
                </Form.Item>
                <Form.Item
                    name="favicon"
                    label="Favicon URL"
                    rules={[
                        {
                            type: "url",
                            message: "url 형식이 잘못 되었습니다.",
                        },
                    ]}
                >
                    <Input
                        name={"favicon"}
                        placeholder="favicon url을 입력해 주세요."
                        onChange={(e: any) => handleChange(e)}
                    />
                </Form.Item>
                <Form.Item
                    name="category"
                    label="카테고리"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: "필수값 입니다.",
                        },
                        {
                            type: "string",
                            max: 30,
                            message: "카테고리는 30자 이내로 입력해 주세요.",
                        },
                    ]}
                >
                    <Input
                        name={"category"}
                        placeholder="카테고리를 입력해 주세요."
                        onChange={(e: any) => handleChange(e)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookmarkSaveModal;
