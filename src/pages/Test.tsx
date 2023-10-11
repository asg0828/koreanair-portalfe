// import { useState, useEffect } from 'react';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import apiClient from '@utils/apiClient';

// export default function TestPage() {
//   const [getResult, setGetResult] = useState(false);
//   const [postResult, setPostResult] = useState(false);

//   const fortmatResponse = (res) => {
//     return JSON.stringify(res, null, 2);
//   };

//   const { isFetching: isGetLoading, refetch } = useQuery(
//     ['query-test-get'],
//     async () => {
//       return await apiClient.get('http://localhost:8080');
//     },
//     {
//       enabled: false,
//       onSuccess: (res) => {
//         console.log('res: ', res);
//         const result = {
//           status: res.status,
//           headers: res.headers,
//           data: res.data,
//         };
//         setGetResult(fortmatResponse(result));
//       },
//       onError: (err) => {
//         console.log('err: ', err);
//       },
//     }
//   );

//   const { isFetching: isPostLoading, mutate } = useMutation(
//     async () => {
//       return await apiClient.post(`http://localhost:8080`, {
//         name: 'test',
//         value: 'aaa',
//       });
//     },
//     {
//       onSuccess: (res) => {
//         const result = {
//           status: res.status,
//           headers: res.headers,
//           data: res.data,
//         };
//         setPostResult(fortmatResponse(result));
//       },
//       onError: (err) => {},
//     }
//   );

//   useEffect(() => {
//     if (isGetLoading) setGetResult('get loading...');
//   }, [isGetLoading]);

//   useEffect(() => {
//     if (isPostLoading) setPostResult('post loading...');
//   }, [isPostLoading]);

//   function getData() {
//     refetch();
//   }

//   function postData() {
//     mutate();
//   }

//   return (
//     <>
//       <h1>테스트 페이지입니다.</h1>

//       <div>
//         <h3>GET 영역</h3>

//         <button onClick={getData}>GET API 호출</button>

//         <p>결과: {getResult}</p>
//       </div>

//       <div>
//         <h3>POST 영역</h3>

//         <button onClick={postData}>POST API 호출</button>

//         <p>결과: {postResult}</p>
//       </div>
//     </>
//   );
// }

const TestPage = () => {
  return (
    <>
      <h1>임시 페이지입니다.</h1>
    </>
  )
}
export default TestPage;