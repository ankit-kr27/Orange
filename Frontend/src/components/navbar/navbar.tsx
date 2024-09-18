import { useAppDispatch, useAppSelector } from "@/app/hooks";
import ThemeToggleSwitch from "../theme-toggle-switch/theme-toggle-switch";
import { RootState } from "@/app/store";
import { logoutUser } from "@/features/auth-slice";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser());
            navigate("/");
        } catch (error) {
            console.error("Logout failed: ", error);
        }
    };
    return (
        <div className="mx-auto flex max-w-7xl justify-between py-6">
            <div>
                <svg
                    width="52"
                    height="52"
                    viewBox="0 0 52 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M18.9223 33.6997C19.2714 33.9872 19.6731 34.0308 20.1749 34.017C20.1749 34.017 21.8774 34.0567 23.5844 33.3511C25.2902 32.6434 26.4651 31.4114 26.4651 31.4114C26.7991 31.0785 27.0839 30.7523 27.1276 30.3014C27.1718 29.851 27.0112 29.4039 26.6912 29.0839L19.0175 21.4113C18.9089 21.3028 18.7462 21.2697 18.6046 21.3284C18.4636 21.3877 18.3707 21.5254 18.3708 21.6787L18.3702 32.5308C18.3706 32.9835 18.5732 33.4121 18.9223 33.6997Z"
                        fill="#EB5E28"
                        stroke="#EB5E28"
                        strokeWidth="0.390625"
                    />
                    <path
                        d="M14.169 33.778C14.6395 33.7785 15.0725 33.7493 15.4223 33.4613C15.7708 33.1744 15.9734 32.7446 15.9728 32.2931L15.9739 21.4394C15.9739 21.2872 15.8816 21.149 15.7395 21.0897C15.5985 21.0315 15.4363 21.064 15.3277 21.1725L7.65401 28.8462C7.3334 29.1668 7.17283 29.6116 7.21703 30.062C7.2607 30.5129 7.51413 30.828 7.87887 31.1737C7.87887 31.1737 9.05315 32.4051 10.7596 33.1122C12.4666 33.8187 14.169 33.778 14.169 33.778Z"
                        fill="#EB5E28"
                        stroke="#EB5E28"
                        strokeWidth="0.390625"
                    />
                    <path
                        d="M32.2881 15.9777C32.7406 15.9772 33.1699 15.7752 33.4573 15.4262C33.7454 15.0764 33.788 14.6737 33.774 14.1718C33.774 14.1718 33.8148 12.4705 33.1083 10.7634C32.4011 9.05706 31.1697 7.88278 31.1697 7.88278C30.8362 7.5493 30.5089 7.26461 30.0591 7.22095C29.6081 7.1762 29.1629 7.33725 28.8423 7.65786L21.1685 15.3316C21.0611 15.439 21.0281 15.6018 21.0862 15.7439C21.145 15.8854 21.2832 15.9778 21.436 15.9772L32.2881 15.9777Z"
                        fill="#EB5E28"
                        stroke="#EB5E28"
                        strokeWidth="0.390625"
                    />
                    <path
                        d="M31.4087 26.4689C31.4087 26.4689 32.64 25.2935 33.3478 23.5876C34.0539 21.8801 34.0135 20.1793 34.0135 20.1793C34.0142 19.7077 33.9839 19.2747 33.6969 18.9251C33.4082 18.577 32.9803 18.3751 32.5271 18.374L21.6744 18.374C21.5222 18.3751 21.384 18.4673 21.3253 18.6078C21.2671 18.7488 21.2996 18.9121 21.4081 19.0207L29.0818 26.6944C29.4013 27.0138 29.8484 27.1744 30.2982 27.1308C30.7484 27.0877 31.0634 26.8343 31.4087 26.4689Z"
                        fill="#EB5E28"
                        stroke="#EB5E28"
                        strokeWidth="0.390625"
                    />
                    <path
                        d="M32.4587 4.04132C39.3872 11.9546 39.084 23.9944 31.5367 31.5417C23.991 39.0873 11.9513 39.3905 4.03741 32.4626L1 35.5C3.93055 38.125 7.34726 39.926 10.9396 40.8866C15.0909 41.9966 19.489 41.996 23.6402 40.886C27.6422 39.8158 31.4315 37.7116 34.5674 34.5757C43.7763 25.3668 44.0846 10.5805 35.5 1L32.4587 4.04132Z"
                        fill="#EB5E28"
                        stroke="#EB5E28"
                        strokeWidth="0.390625"
                    />
                </svg>
            </div>
            <div>
                <h1 className="text-center text-4xl font-extrabold text-orange-600">
                    ORANGE
                </h1>
            </div>
            <div>
                <ThemeToggleSwitch />
                <Button
                    onClick={handleLogout}
                    color="primary"
                    size="md"
                    disabled={loading}
                >
                    {loading ? "Logging out..." : "Log Out"}
                </Button>
            </div>
        </div>
    );
}

export default Navbar;
