
import {
    Stack,
} from '@components/ui'
import AttrMstrProfInfo from '@/components/self-feature-adm/AttrMstrProfInfo'
import BehvMstrProfInfo from '@/components/self-feature-adm/BehvMstrProfInfo'

const MasterProfileManagementReg = () => {
    return (
        <Stack>
            <AttrMstrProfInfo />
            <BehvMstrProfInfo />
        </Stack>
    )
}

export default MasterProfileManagementReg