// utils.ts

// Set theme color
// TODO: 아래 setThemeColor는 사용하지 않는 함수입니다. 추후 삭제 예정.
export const setThemeColor = (color: string) => {
    document.documentElement.style.setProperty("--primary-color", color);
};
