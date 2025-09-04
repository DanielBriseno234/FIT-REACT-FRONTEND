import { FaPlus } from 'react-icons/fa'
import { NormalButton } from '../../components/Utiles/Buttons/NormalButton'
import PageHeader from '../../components/Utiles/Page/PageHeader'

const ProgramacionClasePage = () => {
    return (
        <>
            <PageHeader
                title="Programación de Clases"
                description="Administra la programación de clases de tu sistema"
                action={
                    <NormalButton
                        type="button"
                        // onClick={() => handleAddModalOpen()}
                        tooltip="Agregar Programación"
                    >
                        <FaPlus />
                        Agregar
                    </NormalButton>
                }
            />
        </>
    )
}

export default ProgramacionClasePage
