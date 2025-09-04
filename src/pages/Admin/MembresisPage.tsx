import React, { useEffect, useRef, useState } from 'react'
import type { MembresiaItem } from '../../interfaces/membresia/Membresia'
import { useMembresias } from '../../hooks/Membresia/useMembresias'
import Loader from '../../components/Utiles/Loader/Loader'
import LoadError from '../../components/Generales/LoadError'
import { getErrorMessage } from '../../helpers/errorHelper'
import PageHeader from '../../components/Utiles/Page/PageHeader'
import { NormalButton } from '../../components/Utiles/Buttons/NormalButton'
import { FaPlus, FaTrash } from 'react-icons/fa'
import PageContent from '../../components/Utiles/Page/PageContent'
import { Input, Option, Select } from '@material-tailwind/react'
import EmptyState from '../../components/Utiles/Page/EmptyState'
import FooterPagination from '../../components/Utiles/Pagination/FooterPagination'
import ProfessionalModal from '../../components/Utiles/Modals/Modal'
import ConfirmationModal from '../../components/Utiles/Modals/ConfirmationModal'
import { MdRestartAlt } from 'react-icons/md'
import MembresiaList from '../../components/Membresia/MembresiaList'
import { useMembresiaMutations } from '../../hooks/Membresia/useMembresiaMutations'
import toast from 'react-hot-toast'

type ModalMembresiaType = {
    isOpen: boolean
    action: "none" | "add" | "update" | "inactivate" | "reactivate"
    membresia: null | MembresiaItem //| UsuarioOutputType
}

const MembresisPage = () => {
    const [selectedMembresiaId, setSelectedMembresiaId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const [status, setStatus] = useState<"ACTIVA" | "INACTIVA">("ACTIVA");
    const [search, setSearch] = useState("");

    // Hook para obtener la lista de membresias
    const { data, error, isLoading, refetch } = useMembresias(currentPage, pageSize, status, search);
    const membresias = data?.content ?? [];

    // Mutaciones para CRUD
    const { inactivateMembresia, reactivateMembresia, isDeleting, isReactivating, controllerRef } = useMembresiaMutations();

    // Estado para manejar modal de agregar/editar
    const [modal, setModal] = useState<ModalMembresiaType>({
        isOpen: false,
        action: "none",
        membresia: null
    });

    // Funcion qu se ejecuta al cerrar el modal
    const handleCloseModal = () => {
        setSelectedMembresiaId(null)
        setModal({ isOpen: false, action: "none", membresia: null })
    }

    // Funcion que se ejecuta cuando se abre el modal de agregar
    const handleAddModalOpen = () => {
        setModal({
            isOpen: true,
            action: "add",
            membresia: null
        })
    }

    // Funcion que se ejecuta cuando se abre el modal de editat
    const handleEditModalOpen = (id: number) => {
        setModal({
            isOpen: true,
            action: "update",
            membresia: null
        })
        setSelectedMembresiaId(id);
    }

    // Funcion que se ejecuta cuando se abre el modal para desactivar
    const handleInactivateModalOpen = (membresia: MembresiaItem) => {
        setModal({
            isOpen: true,
            action: "inactivate",
            membresia
        });
    };

    // Funcion que se ejecuta cuando se abre el modal para reactivar
    const handleReactivateModalOpen = (membresia: MembresiaItem) => {
        setModal({
            isOpen: true,
            action: "reactivate",
            membresia
        });
    }


    const handleinactivateMembresia = async (id: number) => {
        try {
            const response = await inactivateMembresia(id);
            toast.success(response.mensaje);
            handleCloseModal();
            // invalidateMembresia();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al eliminar la membresía");
        }
    }

    const handleReactivateMembresia = async (id: number) => {
        try {
            const response = await reactivateMembresia(id);
            toast.success(response.mensaje);
            handleCloseModal();
            // invalidateMembresia();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al reactivar la membresía");
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
                message="Cargando las membresias..."
            />
        );
    }

    if (error) {
        return (
            <LoadError
                titulo="Error al cargar las membresías"
                mensaje={getErrorMessage(error) || "No se pudo obtener la lista de membresías"}
                textoBoton='Reintentar'
                onReintentar={() => { refetch() }}
            />
        );
    }

    return (
        <>
            <PageHeader
                title="Gestión de Membresías"
                description="Administra las membresías que ofreces"
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
                            onChange={(val) => setStatus(val as "ACTIVA" | "INACTIVA")}
                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        >
                            <Option value="ACTIVA">ACTIVA</Option>
                            <Option value="INACTIVA">INACTIVA</Option>
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
                {membresias.length === 0 ? (
                    <EmptyState
                        type={search ? 'search' : 'empty'}
                        title={search ? 'No se encontraron membresías' : `Sin membresías ${status}`}
                        description={
                            search
                                ? `No encontramos resultados para "${search}". Prueba con otro término de búsqueda.`
                                : `No hay membresías con estatus "${status}". Intenta con otra opción.`
                        }
                    />
                ) : (
                    <>
                        <MembresiaList
                            membresias={membresias}
                            onUpdateMembresia={id => handleEditModalOpen(id)}
                            onInactivateMembresia={membresia => handleInactivateModalOpen(membresia)}
                            onReactivateMembresia={membresia => handleReactivateModalOpen(membresia)}
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
                title={modal.membresia ? 'Editar Membresía' : 'Agregar Membresía'}
                size="2xl"
            >
                <h1>FORMULARIO</h1>
                {/* {isLoadingUsuario ? (
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
                )} */}
            </ProfessionalModal>

            {/* Modal para reactivacion */}
            <ConfirmationModal
                isOpen={modal.isOpen && modal.action === "reactivate"}
                onClose={() => {
                    handleCloseModal();
                    controllerRef.current?.abort();
                }}
                onConfirm={() => {
                    if (modal.membresia?.id) {
                        handleReactivateMembresia(modal.membresia.id)
                    }
                }}
                title="Confirmar Reactivación"
                message={`¿Estás seguro de reactivar la membresía "${modal.membresia?.nombre}"?`}
                description='Al activar esta membresía, estará disponible para que nuevos usuarios puedan adquirirla o renovarla.'
                confirmText="Reactivar"
                iconConfirm={<MdRestartAlt />}
                isLoading={isReactivating}
            />

            {/* Modal para eliminación */}
            <ConfirmationModal
                isOpen={modal.isOpen && modal.action === "inactivate"}
                onClose={() => {
                    handleCloseModal()
                    controllerRef.current?.abort()
                }}
                onConfirm={() => {
                    if (modal.membresia?.id) {
                        handleinactivateMembresia(modal.membresia.id);
                    }
                }}
                title="Confirmar Desactivación"
                message={`¿Estás seguro de desactivar la membresía "${modal.membresia?.nombre}"?`}
                description='Al desactivar esta membresía, los usuarios que la tengan activa podrán utilizarla hasta su fecha de vencimiento. Después de esa fecha, deberán renovarla seleccionando una membresía diferente.'
                confirmText="Desactivar"
                iconConfirm={<FaTrash />}
                isLoading={isDeleting}
            />
        </>
    )
}

export default MembresisPage
