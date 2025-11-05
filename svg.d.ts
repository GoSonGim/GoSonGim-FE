declare module '*.svg' {  // 모든 .svg 확장자를 가진 파을 module로 선언한다
  import React from 'react';
  const SVGComponent: React.FC<React.SVGProps<SVGSVGElement>>; // SVG 엘리먼트가 받을수있는 모든 props
  export default SVGComponent; // 위 SVGComponents를 내보
}