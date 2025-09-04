import PageHeader from '../../components/Utiles/Page/PageHeader'
import { NormalButton } from '../../components/Utiles/Buttons/NormalButton'
import { FaPlus } from 'react-icons/fa'

const ClasePage = () => {
    return (
        <>
            <PageHeader
                title="Gestión de Clases"
                description="Administra las clases de tu sistema"
                action={
                    <NormalButton
                        type="button"
                        // onClick={() => handleAddModalOpen()}
                        tooltip="Agregar Clase"
                    >
                        <FaPlus />
                        Agregar
                    </NormalButton>
                }
            />
        </>
    )
}

export default ClasePage
