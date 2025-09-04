import { motion } from "framer-motion";

interface FormSkeletonProps {
    delay?: number
}

const FormSkeleton: React.FC<FormSkeletonProps> = ({
    delay = 0.5
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay, duration: 0.5 }}
            className="space-y-4 animate-pulse"
        >
            {/* <div className="space-y-4 animate-pulse"> */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 space-y-5">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>

                {/* Campos de formulario esqueleto */}
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>

                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* Botones esqueleto */}
            <div className="flex justify-end gap-4">
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
            {/* </div> */}
        </motion.div>
    )
}

export default FormSkeleton
