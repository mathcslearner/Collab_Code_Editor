import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

const Page = () => {
    return(
        <SignIn appearance={{
            baseTheme: dark, 
            elements: {
                foorterActionLink: {
                    color: "#fff"
                }
            }
        }}
        />
    )
}

export default Page