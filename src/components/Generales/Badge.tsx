const variantClasses = {
    "primary": 'bg-[var(--color-primary)]',
    "success": 'bg-[var(--color-success)]',
    "danger": 'bg-[var(--color-error)]',
};

interface BadgeProps {
    children: React.ReactNode
    variant?: "primary" | "success" | "danger"
    className?: string
}

const Badge = ({ children, variant = "primary", className = '' }: BadgeProps) => {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} text-white ${className}`}>
            {children}
        </span>
    );
};

export default Badge;