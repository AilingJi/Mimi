import WelcomeCard from "./WelcomeCard";

export default function Greeting({ isLoggedIn }) {
    return (
        <div>
            {isLoggedIn && <WelcomeCard name="Ailing Ji" />}
        </div>
    )
}