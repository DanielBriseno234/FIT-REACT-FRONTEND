import type { NivelAccesoItem, NivelAccesoOutput } from "../NivelAcceso/NivelAcceso"

export type ModalNivelAccesoType = {
    isOpen: boolean
    action: "none" | "add" | "update" | "delete" | "reactivate"
    nivelAcceso: null | NivelAccesoItem | NivelAccesoOutput
}