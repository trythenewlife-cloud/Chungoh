import Image from "next/image";

// 기존 사이트(chung-oh.co.kr) 로고 이미지. 어두운 테마에서는 글자만 흰색으로 바꾼다.
const darkText = "[[data-theme=dark]_&]:brightness-0 [[data-theme=dark]_&]:invert";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image src="/brand/mark.png" alt="" width={234} height={235} priority className="h-9 w-9" />
      <span className="flex w-[150px] flex-col gap-[3px]">
        <Image src="/brand/name-ko.png" alt="(주)청오엔지니어링" width={561} height={87} priority className={`h-auto w-full ${darkText}`} />
        <Image src="/brand/name-en.png" alt="" width={534} height={33} priority className={`h-auto w-[95%] ${darkText}`} />
      </span>
    </span>
  );
}
