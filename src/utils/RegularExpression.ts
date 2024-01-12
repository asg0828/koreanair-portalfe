// HTML 태그
export const htmlTagReg = /<[^>]*>/g;

// HTML 특수문자
export const htmlSpeReg = /&(lt|gt|nbsp);/g;

// 영문, 숫자, 언더바
export const tbColReg = /^[a-zA-Z0-9_]*$/;

// http:// https://
export const httpReg = /http(s)?:\/\//g;

// http, https URL
export const httpUrlReg =
  /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

// <iframe>, <embed>로 시작하고 >로 끝나는 문자열
export const exceptTagReg = /<(iframe|embed)>.*>/;

// 이미지 태그
export const imageTagReg = /<img[^>]*>/g;
// 이미지 태그의 title 부분
export const imageTitleReg = /title="([^"]*)"/g;
// 이미지 태그의 id 부분
export const imageIdReg = /id=".*"/g;
// 이미지 태그의 blob src
export const imageBlobSrc = /"([^"]*data:image[^"]*)"/g;
// 이미지 태그의 src
export const imageSrc = /src=".*"/g;
// 이미지 태그의 id
export const imageId = /fl\d{11}/;