import { FaLock, FaPlus, FaTrash } from "react-icons/fa"
import PageHeader from "../../components/Utiles/Page/PageHeader"
import { NormalButton } from "../../components/Utiles/Buttons/NormalButton"
import { useUsuarios } from "../../hooks/Usuario/useUsuarios"
import { useEffect, useRef, useState } from "react"
import Loader from "../../components/Utiles/Loader/Loader"
import LoadError from "../../components/Generales/LoadError"
import { getErrorMessage } from "../../helpers/errorHelper"
import PageContent from "../../components/Utiles/Page/PageContent"
import FooterPagination from "../../components/Utiles/Pagination/FooterPagination"
import UsuarioList from "../../components/Usuario/UsuarioList"
import EmptyState from "../../components/Utiles/Page/EmptyState"
import { Input, Option, Select } from "@material-tailwind/react"
import { useUsuarioMutations } from "../../hooks/Usuario/useUsuarioMutations"
import type { UsuarioCambiarContrasena, UsuarioInputType, UsuarioInputUpdateType, UsuarioItem } from "../../interfaces/Usuario/Usuario"
import toast from "react-hot-toast"
import ConfirmationModal from "../../components/Utiles/Modals/ConfirmationModal"
import { MdRestartAlt } from "react-icons/md"
import ProfessionalModal from "../../components/Utiles/Modals/Modal"
import { useUsuario } from "../../hooks/Usuario/useUsuario"
import FormSkeleton from "../../components/Utiles/Loader/FormSkeleton"
import UsuarioForm from "../../components/Usuario/UsuarioForm"
import type { UsuarioOutputType } from "../../interfaces/Usuario/Usuario"
import UsuarioChagePassForm from "../../components/Usuario/UsuarioChagePassForm"
import { useAuthStore } from "../../store/authStore"

type ModalUsuarioType = {
    isOpen: boolean
    action: "none" | "add" | "update" | "delete" | "reactivate" | "block" | "changePass"
    usuario: null | UsuarioItem | UsuarioOutputType
}

const UsuarioPage = () => {
    const { user } = useAuthStore();

    const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const [status, setStatus] = useState<"ACTIVO" | "INACTIVO" | "BLOAQUEADO">("ACTIVO");
    const [search, setSearch] = useState("");

    // Hook para obtener la lista de usuarios
    const { data, error, isLoading, refetch } = useUsuarios(currentPage, pageSize, status, search);
    const usuarios = data?.content.filter(u => u.id !== user?.id) ?? [];

    // Mutaciones para CRUD
    const { addUsuario, updateUsuario, deleteUsuario, reactivateUsuario, blockUsuario, changePassUsuario, isDeleting, isReactivating, isBlocking, isAdding, isUpdating, isChangingPass, controllerRef } = useUsuarioMutations();

    // Hook para obtener un usuario especifico
    const { data: usuario, error: errorUsuario, invalidateUsuario, isLoading: isLoadingUsuario } = useUsuario(selectedUsuarioId ?? 0)

    // Estado para manejar modal de agregar/editar
    const [modal, setModal] = useState<ModalUsuarioType>({
        isOpen: false,
        action: "none",
        usuario: null
    });

    // Funcion qu se ejecuta al cerrar el modal
    const handleCloseModal = () => {
        setSelectedUsuarioId(null)
        setModal({ isOpen: false, action: "none", usuario: null })
    }

    // Funcion que se ejecuta cuando se abre el modal de agregar
    const handleAddModalOpen = () => {
        setModal({
            isOpen: true,
            action: "add",
            usuario: null
        })
    }

    // Funcion que se ejecuta cuando se abre el modal de editat
    const handleEditModalOpen = (id: number) => {
        setModal({
            isOpen: true,
            action: "update",
            usuario: null
        })
        setSelectedUsuarioId(id);
    }

    // Funcion que se ejecuta cuando se abre el modal para eliminar
    const handleDeleteModalOpen = (usuario: UsuarioItem) => {
        setModal({
            isOpen: true,
            action: "delete",
            usuario
        });
    };

    // Funcion que se ejecuta cuando se abre el modal para reactivar
    const handleReactivateModalOpen = (usuario: UsuarioItem) => {
        setModal({
            isOpen: true,
            action: "reactivate",
            usuario
        });
    }

    // Funcion que se ejecuta cuando se abre el modal para reactivar
    const handleBlockModalOpen = (usuario: UsuarioItem) => {
        setModal({
            isOpen: true,
            action: "block",
            usuario
        });
    }

    // Funcion que se ejecuta cuando se abre el modal para cambiar contraseña
    const handleChangePassModalOpen = (usuario: UsuarioItem) => {
        setModal({
            isOpen: true,
            action: "changePass",
            usuario
        });
    }

    const handleAddUsuario = async (data: UsuarioInputType) => {
        try {
            const response = await addUsuario(data);
            toast.success(response.mensaje);
            handleCloseModal();
            // invalidateUsuario();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al agregar el usuario");
        }
    };

    const handleUpdateUsuario = async (id: number, data: UsuarioInputUpdateType) => {
        try {
            const response = await updateUsuario({ id, data });
            toast.success(response.mensaje);
            handleCloseModal();
            // invalidateUsuario();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al actualizar el usuario");
        }
    };

    const handledeleteUsuario = async (id: number) => {
        try {
            const response = await deleteUsuario({ id, data: { notificarUsuario: false } });
            toast.success(response.mensaje);
            handleCloseModal();
            // invalidateUsuario();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al eliminar el usuario");
        }
    }

    const handleReactivateUsuario = async (id: number) => {
        try {
            const response = await reactivateUsuario({ id, data: { notificarUsuario: false } });
            toast.success(response.mensaje);
            handleCloseModal();
            // invalidateUsuario();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al reactivar el usuario");
        }
    }

    const handleBlockUsuario = async (id: number) => {
        try {
            const response = await blockUsuario({ id, data: { notificarUsuario: false } });
            toast.success(response.mensaje);
            handleCloseModal();
            // invalidateUsuario();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al bloquear el usuario");
        }
    }

    const handleChangePassUsuario = async (id: number, data: UsuarioCambiarContrasena) => {
        try {
            const response = await changePassUsuario({ id, data });
            toast.success(response.mensaje);
            handleCloseModal();
            // invalidateUsuario();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al cambiar la contraseña");
        }
    }

    const firstLoadRef = useRef(true);

    useEffect(() => {
        if (data) {
            firstLoadRef.current = false;
        }
    }, [data]);

    const isFirstLoading = isLoading && firstLoadRef.current;

    if (isFirstLoading) {
        return (
            <Loader
                delay={0}
                message="Cargando los usuarios..."
            />
        );
    }

    if (error) {
        return (
            <LoadError
                titulo="Error al cargar los usuarios"
                mensaje={getErrorMessage(error) || "No se pudo obtener la lista de usuarios"}
                textoBoton='Reintentar'
                onReintentar={() => { refetch() }}
            />
        );
    }

    return (
        <>
            <PageHeader
                title="Gestión de Usuarios"
                description="Administra los usuarios de tu sistema"
                action={
                    <NormalButton
                        type="button"
                        onClick={() => handleAddModalOpen()}
                        tooltip="Agregar Usuario"
                    >
                        <FaPlus />
                        Agregar
                    </NormalButton>
                }
            />
            <PageContent>
                <div className=" space-y-3 md:flex md:justify-between md:space-y-0">
                    <div className="md:w-52">
                        <Select
                            label="Estatus"
                            value={status}
                            onChange={(val) => setStatus(val as "ACTIVO" | "INACTIVO")}
                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        >
                            <Option value="ACTIVO">ACTIVO</Option>
                            <Option value="INACTIVO">INACTIVO</Option>
                            <Option value="BLOQUEADO">BLOQUEADO</Option>
                        </Select>
                    </div>
                    <div className="md:w-52">
                        <Input
                            label="Búsqueda"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(0);
                            }}
                            onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                        />
                    </div>
                </div>
                {usuarios.length === 0 ? (
                    <EmptyState
                        type={search ? 'search' : 'empty'}
                        title={search ? 'No se encontraron usuarios' : `Sin usuarios ${status}`}
                        description={
                            search
                                ? `No encontramos resultados para "${search}". Prueba con otro término de búsqueda.`
                                : `No hay usuarios con estatus "${status}". Intenta con otra opción.`
                        }
                    />
                ) : (
                    <>
                        <UsuarioList
                            usuarios={usuarios}
                            onUpdateUsuario={id => handleEditModalOpen(id)}
                            onDeleteUsuario={usuario => handleDeleteModalOpen(usuario)}
                            onReactivateUsuario={usuario => handleReactivateModalOpen(usuario)}
                            onBlockUsuario={usuario => handleBlockModalOpen(usuario)}
                            onChangePassUsuario={usuario => handleChangePassModalOpen(usuario)}
                        />
                        <FooterPagination
                            currentPage={data?.number ?? 0}
                            totalPages={data?.totalPages ?? 0}
                            pageSize={pageSize}
                            onPageSizeChange={(size) => {
                                setPageSize(size);
                                setCurrentPage(0);
                            }}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </>
                )}
            </PageContent>

            {/* Modal para agregar */}
            <ProfessionalModal
                isOpen={modal.isOpen && (modal.action === "add" || modal.action === "update")}
                onClose={handleCloseModal}
                title={modal.usuario ? 'Editar Usuario' : 'Agregar Usuario'}
                size="2xl"
            >
                {isLoadingUsuario ? (
                    <FormSkeleton delay={0} />
                ) : (

                    <UsuarioForm
                        initialData={usuario}
                        onSubmit={(data) => {
                            if (modal.action === "add") {
                                handleAddUsuario(data as UsuarioInputType);
                            } else if (modal.action === "update" && modal.usuario?.id) {
                                handleUpdateUsuario(modal.usuario.id, data);
                            }
                        }}
                        onCancel={() => {
                            handleCloseModal();
                            controllerRef.current?.abort();
                        }}
                        isLoading={isAdding || isUpdating}
                        mode={modal.action as "add" | "update"}
                    />
                )}
            </ProfessionalModal>

            {/* Modal para editar contraseña */}
            <ProfessionalModal
                isOpen={modal.isOpen && modal.action === "changePass"}
                onClose={handleCloseModal}
                title='Cambiar contraseña'
                size="xl"
            >
                <UsuarioChagePassForm
                    usuario={modal.usuario as UsuarioItem}
                    onCancel={() => {
                        handleCloseModal();
                        controllerRef.current?.abort();
                    }}
                    onSubmit={(data) => {
                        if (modal.usuario?.id) {
                            handleChangePassUsuario(modal.usuario.id, data)
                        }
                    }}
                />
            </ProfessionalModal>

            {/* Modal para reactivacion */}
            <ConfirmationModal
                isOpen={modal.isOpen && modal.action === "reactivate"}
                onClose={() => {
                    handleCloseModal();
                    controllerRef.current?.abort();
                }}
                onConfirm={() => {
                    if (modal.usuario?.id) {
                        handleReactivateUsuario(modal.usuario.id)
                    }
                }}
                title="Confirmar Reactivación"
                message={`¿Estás seguro de reactivar el usuario "${modal.usuario?.nombres}"?`}
                confirmText="Reactivar"
                iconConfirm={<MdRestartAlt />}
                isLoading={isReactivating}
            />

            {/* Modal para eliminación */}
            <ConfirmationModal
                isOpen={modal.isOpen && modal.action === "delete"}
                onClose={() => {
                    handleCloseModal()
                    controllerRef.current?.abort()
                }}
                onConfirm={() => {
                    if (modal.usuario?.id) {
                        handledeleteUsuario(modal.usuario.id);
                    }
                }}
                title="Confirmar Desactivación"
                message={`¿Estás seguro de desactivar el usuario "${modal.usuario?.nombres}"?`}
                confirmText="Desactivar"
                iconConfirm={<FaTrash />}
                isLoading={isDeleting}
            />

            {/* Modal para bloquear */}
            <ConfirmationModal
                isOpen={modal.isOpen && modal.action === "block"}
                onClose={() => {
                    handleCloseModal()
                    controllerRef.current?.abort()
                }}
                onConfirm={() => {
                    if (modal.usuario?.id) {
                        handleBlockUsuario(modal.usuario.id);
                    }
                }}
                title="Confirmar Bloqueo"
                message={`¿Estás seguro de bloquear el usuario "${modal.usuario?.nombres}"?`}
                confirmText="Bloquear"
                iconConfirm={<FaLock />}
                isLoading={isDeleting}
            />
        </>
    )
}

export default UsuarioPage
