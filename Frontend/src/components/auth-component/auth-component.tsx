import SignInComponent from "@/components/sign-in-form/sign-in-form";

const AuthComponent = () => {
    return (
        <div className="mx-auto max-w-sm flex-1 rounded-lg border-2 border-gray-500 p-8 py-10">
            <h1 className="font-extrabold text-4xl text-orange-600 text-center">ORANGE</h1>
            <SignInComponent />
        </div>
    );
};

export default AuthComponent;
