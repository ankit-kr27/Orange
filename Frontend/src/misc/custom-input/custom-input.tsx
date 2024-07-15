import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegisterReturn } from "react-hook-form";

interface ICustomInputProps {
    label: string;
    type: string;
    id: string;
    register: UseFormRegisterReturn;
    error?: string;
    className?: string;
}

const CustomInput = ({label, type, id, register, error, className}: ICustomInputProps) => {
    return (
        <div className="relative">
            <Label htmlFor="email" className="text-gray text-sm">
                {label}
            </Label>
            <Input
                {...register}
                type={type}
                id={id}
                className={`active:bg-none ${className}`}
            />
            {error && <p className="absolute text-red-600 text-xs font-light">{error}</p>}
        </div>
    );
};

export default CustomInput;
