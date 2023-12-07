import { MstrProfMetaTblColumnListProps, TbCoMetaTblClmnInfo } from "@/models/selfFeature/FeatureAdmModel"
import { useState, useEffect } from "react"

import {
    Checkbox,
    Label,
    Stack, Typography,
} from '@components/ui'
import { DivisionTypes } from "@/models/selfFeature/FeatureModel"
import {
    KeyboardArrowDownOutlinedIcon,
    KeyboardArrowUpOutlinedIcon,
} from "@/assets/icons"

const MstrProfMetaTblColumnList = ({
    editMode,
    infoType,
    metaTblInfo,
    metaTblClmnList,
}: MstrProfMetaTblColumnListProps) => {

    // 항목 리스트 show / hide 처리
    const [isColListShow, setIsColListShow] = useState<Boolean>(true)

    useEffect(() => {
        if (!metaTblInfo || !metaTblInfo.clmnAllChocYn) return
        
        if (metaTblInfo.clmnAllChocYn === "Y") setIsColListShow(false)
        else setIsColListShow(true)

    }, [metaTblInfo.clmnAllChocYn])

    return (
        <Stack
            direction="Vertical"
            justifyContent="Start"
            gap="LG"
            style={{
                paddingLeft: "11%",
            }}
        >
            {/* 상세 */}
            {!editMode &&
                <>
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start"
                        style={{
                            position: "relative"
                        }}
                    >
                        <Typography
                            style={{
                                width: "10%",
                                fontWeight: "700",
                            }}
                            variant="body2"
                        >
                            항목추가
                        </Typography>
                        <Checkbox
                            checked={metaTblInfo.clmnAllChocYn === 'Y'}
                            disabled
                        />
                        <Label style={{
                            fontSize: "0.75rem",
                            color: "rgb(85, 85, 85)",
                            lineHeight: "1.5",
                            fontWeight: "400",
                            textAlign: "start",
                            marginLeft: "0.5%",
                        }}>
                            항목 전체선택
                        </Label>
                        {isColListShow &&
                            <KeyboardArrowUpOutlinedIcon
                                style={{
                                    position: "absolute",
                                    right: "0px"
                                }}
                                onClick={() => setIsColListShow(!isColListShow)}
                            />
                        }
                        {!isColListShow &&
                            <KeyboardArrowDownOutlinedIcon
                                style={{
                                    position: "absolute",
                                    right: "0px"
                                }}
                                onClick={() => setIsColListShow(!isColListShow)}
                            />
                        }
                    </Stack>
                    {(isColListShow && metaTblClmnList.length > 0) &&
                        metaTblClmnList.map((clmnInfo: TbCoMetaTblClmnInfo, index: number) => {
                            return (
                                <Stack
                                    key={index}
                                    direction="Horizontal"
                                    style={{
                                        border: '1px solid rgb(218, 218, 218)',
                                        borderRadius: '5px',
                                        background: 'white',
                                        color: (infoType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                                        padding: "1rem"
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        style={{
                                            width: "40%",
                                            color: (infoType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                                        }}
                                    >
                                        {`${clmnInfo.metaTblClmnLogiNm} [${clmnInfo.metaTblClmnPhysNm}]`}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        style={{
                                            color: (infoType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                                        }}
                                    >
                                        {clmnInfo.metaTblClmnLogiNm}
                                    </Typography>
                                </Stack>
                            )
                        })
                    }
                </>
            }
            {/* 상세 */}
            {/* 등록 및 수정 */}
            {editMode &&
                <>
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start"
                        style={{
                            position: "relative"
                        }}
                    >
                        <Typography
                            style={{
                                width: "10%",
                                fontWeight: "700",
                            }}
                            variant="body2"
                        >
                            항목추가
                        </Typography>
                        <Checkbox

                        />
                        <Label style={{
                            fontSize: "0.75rem",
                            color: "rgb(85, 85, 85)",
                            lineHeight: "1.5",
                            fontWeight: "400",
                            textAlign: "start",
                            marginLeft: "0.5%",
                        }}>
                            항목 전체선택
                        </Label>
                        {isColListShow &&
                            <KeyboardArrowUpOutlinedIcon
                                style={{
                                    position: "absolute",
                                    right: "0px"
                                }}
                                onClick={() => setIsColListShow(!isColListShow)}
                            />
                        }
                        {!isColListShow &&
                            <KeyboardArrowDownOutlinedIcon
                                style={{
                                    position: "absolute",
                                    right: "0px"
                                }}
                                onClick={() => setIsColListShow(!isColListShow)}
                            />
                        }
                    </Stack>
                    {(isColListShow && metaTblClmnList.length > 0) &&
                        metaTblClmnList.map((clmnInfo: TbCoMetaTblClmnInfo, index: number) => {
                            return (
                                <Stack
                                    key={index}
                                    direction="Horizontal"
                                    style={{
                                        border: '1px solid rgb(218, 218, 218)',
                                        borderRadius: '5px',
                                        background: 'white',
                                        color: (infoType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                                        padding: "1rem"
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        style={{
                                            width: "40%",
                                            color: (infoType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                                        }}
                                    >
                                        {`${clmnInfo.metaTblClmnLogiNm} [${clmnInfo.metaTblClmnPhysNm}]`}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        style={{
                                            color: (infoType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                                        }}
                                    >
                                        {clmnInfo.metaTblClmnLogiNm}
                                    </Typography>
                                </Stack>
                            )
                        })
                    }
                </>
            }
            {/* 등록 및 수정 */}
        </Stack>
    )
}

export default MstrProfMetaTblColumnList