import { useLocation, useNavigate } from 'react-router-dom'
import {
    Button,
    Stack,
  } from '@components/ui';
const SelfFeatureDetail = () => {

    const location = useLocation()
    const navigate = useNavigate()

    console.log(`row info :: `, location.state)

    const onClickPageMovHandler = (pageNm: string) => {
        if (pageNm === "list")
            navigate('..')
        else
            console.log(`navigate`)
    }

    return (
      <>
        <h1>Self-Feature 상세 페이지입니다.</h1>
        <Stack justifyContent="End" gap="SM" className="width-100">
            {/* <Button size="LG">엑셀다운로드</Button> */}
            <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler('list')}>
                목록
            </Button>
        </Stack>
      </>
    )
  }
  export default SelfFeatureDetail;