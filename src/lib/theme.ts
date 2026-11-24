// <head> 에서 페인트 전에 실행: 저장된 선택, 없으면 운영체제 설정으로 data-theme 를 정한다.
export const themeInitScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;
