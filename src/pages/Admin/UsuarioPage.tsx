import { FaPlus } from "react-icons/fa"
import PageHeader from "../../components/Utiles/Page/PageHeader"
import { NormalButton } from "../../components/Utiles/Buttons/NormalButton"

const UsuarioPage = () => {
    return (
        <>
            <>
                <PageHeader
                    title="Gestión de Usuarios"
                    description="Administra los usuarios de tu sistema"
                    action={
                        <NormalButton
                            type="button"
                            // onClick={() => handleFormModalOpen()}
                            tooltip="Agregar Usuario"
                        >
                            <FaPlus />
                            Agregar
                        </NormalButton>
                    }
                />
            </>

        </>
    )
}

export default UsuarioPage
