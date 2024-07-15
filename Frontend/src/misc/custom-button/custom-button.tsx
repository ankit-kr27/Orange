import { Button } from "@/components/ui/button";

interface ICustomButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    label: string;
    className?: string;
}

const CustomButton = ({ onClick, label, className }: ICustomButtonProps) => {
    return (
        <Button className={`mx-auto bg-orange-600 rounded-xl text-white ${className}`} onClick={onClick}>
            {label}
        </Button>
    );
};

export default CustomButton;
