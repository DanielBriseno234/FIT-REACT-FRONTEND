
const PerfilUsuarioPage = () => {
    return (
        <div>
            Perfil
        </div>
    )
}

export default PerfilUsuarioPage


// import { useState, useEffect } from 'react';
// import { useAuthStore } from '../../store/authStore';
// import { useForm } from 'react-hook-form';
// import toast from 'react-hot-toast';
// import NormalButton from '../../components/Utiles/Botones/NormalButton';

// const PerfilUsuarioPage = () => {
//     const { user, updateProfile, changePassword } = useAuthStore();
//     const [activeTab, setActiveTab] = useState('profile');
//     const [loading, setLoading] = useState(false);
//     const [fotoPreview, setFotoPreview] = useState(user?.fotoPerfil || '');
//     const [fotoBase64, setFotoBase64] = useState('');

//     // Determinar roles
//     const esAdmin = user?.roles?.some(r => r.rol.nombre === 'ADMIN');
//     const esRecepcionista = user?.roles?.some(r => r.rol.nombre === 'RECEPCIONISTA');
//     const esEntrenador = user?.roles?.some(r => r.rol.nombre === 'ENTRENADOR');
//     const esSocio = user?.roles?.some(r => r.rol.nombre === 'SOCIO');

//     // Formulario de perfil
//     const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm();
//     const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset } = useForm({
//         defaultValues: {
//             nombres: user?.nombres || '',
//             apellidos: user?.apellidos || '',
//             email: user?.email || '',
//             telefono: user?.telefono || '',
//             biografia: user?.datosEntrenador?.biografia || user?.datosRecepcionista?.biografia || '',
//             fechaContratacion: user?.datosEntrenador?.fechaContratacion || user?.datosRecepcionista?.fechaContratacion || '',
//             noSocio: user?.datosSocio?.noSocio || '',
//             fechaNacimiento: user?.datosSocio?.fechaNacimiento || '',
//             direccion: user?.datosSocio?.direccion || '',
//             nss: user?.datosSocio?.nss || '',
//             tipoSangre: user?.datosSocio?.tipoSangre || ''
//         }
//     });

//     // Resetear formulario cuando cambia el usuario
//     useEffect(() => {
//         if (user) {
//             reset({
//                 nombres: user.nombres || '',
//                 apellidos: user.apellidos || '',
//                 email: user.email || '',
//                 telefono: user.telefono || '',
//                 biografia: user.datosEntrenador?.biografia || user.datosRecepcionista?.biografia || '',
//                 fechaContratacion: user.datosEntrenador?.fechaContratacion || user.datosRecepcionista?.fechaContratacion || '',
//                 noSocio: user.datosSocio?.noSocio || '',
//                 fechaNacimiento: user.datosSocio?.fechaNacimiento || '',
//                 direccion: user.datosSocio?.direccion || '',
//                 nss: user.datosSocio?.nss || '',
//                 tipoSangre: user.datosSocio?.tipoSangre || ''
//             });
//             setFotoPreview(user.fotoPerfil || '');
//         }
//     }, [user, reset]);

//     // Manejar cambio de foto
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         // Validar tipo y tamaño de imagen
//         if (!file.type.match('image.*')) {
//             toast.error('Por favor selecciona una imagen válida');
//             return;
//         }

//         if (file.size > 2 * 1024 * 1024) { // 2MB
//             toast.error('La imagen no debe exceder los 2MB');
//             return;
//         }

//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setFotoPreview(reader.result);
//             setFotoBase64(reader.result);
//         };
//         reader.readAsDataURL(file);
//     };

//     const onProfileSubmit = async (data) => {
//         try {
//             setLoading(true);

//             // Incluir la foto si se cambió
//             const datosActualizados = {
//                 ...data,
//                 fotoPerfil: fotoBase64 || user.fotoPerfil
//             };

//             await updateProfile(datosActualizados);
//             toast.success('Perfil actualizado correctamente');
//         } catch (err) {
//             toast.error(err.message || 'Error al actualizar el perfil');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const onPasswordSubmit = async (data) => {
//         if (data.newPassword !== data.confirmPassword) {
//             toast.error('Las contraseñas no coinciden');
//             return;
//         }

//         try {
//             setLoading(true);
//             await changePassword(data.currentPassword, data.newPassword);
//             resetPassword();
//             toast.success('Contraseña cambiada correctamente');
//         } catch (err) {
//             toast.error(err.message || 'Error al cambiar la contraseña');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mx-auto py-8 px-4 max-w-4xl">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

//             {/* Card principal */}
//             <div className="bg-white shadow-md rounded-lg overflow-hidden">
//                 {/* Pestañas */}
//                 <div className="border-b border-gray-200">
//                     <nav className="flex -mb-px">
//                         <button
//                             onClick={() => setActiveTab('profile')}
//                             className={`flex-1 py-4 px-1 text-center font-medium text-sm ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                         >
//                             Información
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('password')}
//                             className={`flex-1 py-4 px-1 text-center font-medium text-sm ${activeTab === 'password' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                         >
//                             Contraseña
//                         </button>
//                     </nav>
//                 </div>

//                 {/* Contenido */}
//                 <div className="p-6">
//                     {activeTab === 'profile' && (
//                         <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
//                             {/* Foto de perfil */}
//                             <div className="flex flex-col items-center mb-6">
//                                 {/* <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
//                                     {obtenerAvatarUsuario(user.fotoPerfil || fotoPreview, user.nombres)}
//                                 </div> */}
//                                 <label className="mt-4 flex items-center px-5 py-2 bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] border text-white rounded-lg hover:from-[var(--color-secondary)] hover:to-[var(--color-secondary)] transition duration-300 ease-in-out">
//                                     Cambiar foto
//                                     <input
//                                         type="file"
//                                         className="hidden"
//                                         accept="image/*"
//                                         onChange={handleFileChange}
//                                     />
//                                 </label>
//                             </div>

//                             {/* Información básica */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
//                                     <input
//                                         type="text"
//                                         className={`w-full px-3 py-2 border rounded-md ${profileErrors.nombres ? 'border-red-500' : 'border-gray-300'}`}
//                                         {...registerProfile('nombres', { required: 'Nombre es requerido' })}
//                                     />
//                                     {profileErrors.nombres && <p className="mt-1 text-sm text-red-600">{profileErrors.nombres.message}</p>}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
//                                     <input
//                                         type="text"
//                                         className={`w-full px-3 py-2 border rounded-md ${profileErrors.apellidos ? 'border-red-500' : 'border-gray-300'}`}
//                                         {...registerProfile('apellidos', { required: 'Apellidos son requeridos' })}
//                                     />
//                                     {profileErrors.apellidos && <p className="mt-1 text-sm text-red-600">{profileErrors.apellidos.message}</p>}
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                                     <input
//                                         type="email"
//                                         className={`w-full px-3 py-2 border rounded-md ${profileErrors.email ? 'border-red-500' : 'border-gray-300'}`}
//                                         {...registerProfile('email', {
//                                             required: 'Email es requerido',
//                                             pattern: {
//                                                 value: /^\S+@\S+$/i,
//                                                 message: 'Email no válido'
//                                             }
//                                         })}
//                                         disabled={!esAdmin}
//                                     />
//                                     {profileErrors.email && <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
//                                     <input
//                                         type="tel"
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                         {...registerProfile('telefono')}
//                                     />
//                                 </div>
//                             </div>

//                             {/* Campos para recepcionista/entrenador */}
//                             {(esRecepcionista || esEntrenador) && (
//                                 <div className="space-y-6">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
//                                         <textarea
//                                             rows={3}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                             {...registerProfile('biografia')}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de contratación</label>
//                                         <input
//                                             type="date"
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                             {...registerProfile('fechaContratacion')}
//                                         />
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Campos para socio */}
//                             {esSocio && (
//                                 <div className="space-y-6">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Número de socio</label>
//                                             <input
//                                                 type="text"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
//                                                 {...registerProfile('noSocio')}
//                                                 readOnly
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
//                                             <input
//                                                 type="date"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                                 {...registerProfile('fechaNacimiento')}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
//                                         <input
//                                             type="text"
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                             {...registerProfile('direccion')}
//                                         />
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">NSS</label>
//                                             <input
//                                                 type="text"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                                 {...registerProfile('nss')}
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de sangre</label>
//                                             <input
//                                                 type="text"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                                 {...registerProfile('tipoSangre')}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             <div className="flex justify-end pt-4">
//                                 <NormalButton
//                                     type={"submit"}
//                                     disabled={loading}
//                                     text={loading ? "Guardando..." : "Guardar cambios"}
//                                     tooltip={loading ? "Guardando..." : "Guardar cambios"}
//                                 />
//                             </div>
//                         </form>
//                     )}

//                     {activeTab === 'password' && (
//                         <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
//                                 <input
//                                     type="password"
//                                     className={`w-full px-3 py-2 border rounded-md ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
//                                     {...registerPassword('currentPassword', { required: 'Contraseña actual es requerida' })}
//                                 />
//                                 {passwordErrors.currentPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
//                                 <input
//                                     type="password"
//                                     className={`w-full px-3 py-2 border rounded-md ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
//                                     {...registerPassword('newPassword', {
//                                         required: 'Nueva contraseña es requerida',
//                                         minLength: {
//                                             value: 8,
//                                             message: 'Mínimo 8 caracteres'
//                                         }
//                                     })}
//                                 />
//                                 {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
//                                 <input
//                                     type="password"
//                                     className={`w-full px-3 py-2 border rounded-md ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
//                                     {...registerPassword('confirmPassword', { required: 'Confirmación es requerida' })}
//                                 />
//                                 {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>}
//                             </div>

//                             <div className="flex justify-end pt-4">
//                                 <NormalButton
//                                     type={"submit"}
//                                     disabled={loading}
//                                     text={loading ? "Guardando..." : "Cambiar Contraseña"}
//                                     tooltip={loading ? "Guardando..." : "Cambiar Contraseña"}
//                                 />
//                             </div>
//                         </form>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PerfilUsuarioPage;