import SignInComponent from "@/components/sign-in-component/sign-in-component";

const AuthComponent = () => {
    return (
        <div className="mx-auto max-w-lg flex-1 rounded-lg border-2 border-orange-500 p-6">
            <h1 className="font-extrabold text-4xl text-orange-600 text-center">ORANGE</h1>
            <SignInComponent />
        </div>
    );
};

export default AuthComponent;
