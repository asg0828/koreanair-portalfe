# Getting Started--

## Prerequisite

- [install Node(v16), NPM](https://nodejs.org/en/download/)
- [install yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable)
- [install git](https://git-scm.com/downloads)
- [install vscode](https://code.visualstudio.com/)

## 로컬 환경 구성

로컬 React 환경 구성

## Project Structure

```bash
├─ node_modules/                     # Project dependencies
├─ public/                           # 정적 파일 관리
├─ build/                            # 빌드 output
├─┬ src
│ ├─ api/                            # Api 호출 모듈
│ ├─ assets ─┬
│            ├─ fonts/               # font 관리
│            ├─ icons/               # icon 이미지 관리
│            ├─ styles/              # App 공통 (application.scss), 공통 변수(variables.scss)
│ ├─ components                      # component 관리
│ ├─ locales                         # 다국어 처리 (default: ko)
│ ├─ models                          # model 관리
│ ├─ pages/                          # page 관리
│ ├─ reducer ─┬                      # redux toolkit slice 관리
│             ├─ index.ts            # combine reducer 관리
│ ├─ router/                         # React Router 관리
│ ├─ utils/                          # 공통 모듈성 Util 관리
│ ├─ App.tsx                         # 최상위 component
│ ├─ index.tsx                       # root element에 App.tsx 컴포넌트를 렌더링
|- .env-cmdrc                        # App 환경변수 관리
|- .eslintrc.yml                     # eslint config 설정
|- .prettierrc.yml                   # prettier config 설정
|- package.json                      # 프로젝트 정보 및 의존성(dependencies)을 관리
|- tsconfig.json                     # typescript config 설정
```

## Node

16.16.x

1. npm cache clean -f
2. npm install -g n
3. sudo n 16.16.0
4. node -v

<br><br>

## UI Framework

material design을 사용할 수 있는 https://mui.com/ 를 표준으로 사용<br><br>

## Redux Toolkit

전역 상태 관리로 Redux Toolkit을 사용.<br><br>

## Style

sass 를 개발 표준으로 하며 src/assets/styles 와 component 폴더에서 .scss 파일명으로 관리를 한다.<br><br>

## CI - 소스관리

- GitLab 계정 발급
- GitLab에서 소스코드 clone: git clone http://tbd.git
- [git clone 사용방법](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-clone)
- [Git 설정 참고](https://git-scm.com/book/ko/v2/Git%EB%A7%9E%EC%B6%A4-Git-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0)
- [Git CRLF 개행 설정](https://www.lesstif.com/gitbook/git-crlf-20776404.html)<br><br>

## Prerequisite

- [Install Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)
- brew 로 설치 brew install yarn --ignore-dependencies (node가 있는경우 dependency 제외 옵션 사용)<br><br>

## Install dependendies

```
yarn install
```

<br><br>

## Start application

```
yarn run start
```

Open http://localhost:3000 in a browser.<br><br>

## Lint

```
(for MacOS) yarn run lint
(for Windows) yarn run lint:win
```

<br><br>

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn Redux Toolkit, check out the [Redux Toolkit documentation](https://redux-toolkit.js.org/).
