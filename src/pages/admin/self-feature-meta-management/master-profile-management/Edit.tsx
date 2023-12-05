
import AttrMstrProfInfo from '@/components/self-feature-adm/AttrMstrProfInfo'
import BehvMstrProfInfo from '@/components/self-feature-adm/BehvMstrProfInfo'
import {
    Stack,
} from '@components/ui'

const MasterProfileManagementEdit = () => {
    return (
        <Stack>
            <AttrMstrProfInfo />
            <BehvMstrProfInfo />
        </Stack>
    )
}

export default MasterProfileManagementEdit