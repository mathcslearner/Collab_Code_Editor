import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

const Page = () => {
    return(
        <SignUp appearance={{
            baseTheme: dark,
            elements: {
                footerActionlink: {
                    color: "#A3A3A3"
                }
            }
        }}
        />
    )
}

export default Page