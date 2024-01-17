"use client"
import { useState, useEffect } from "react"
import { env } from "@/config/env"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import {AddNewDeviceDialog} from "@/components/ui/modal-add-new-device";

export type SigninDropdownProps = {
    disabled: boolean
    handleLogin?: (email: string, password: string) => Promise<void>
    handleConnect?: (isComethWallet: boolean) => Promise<void>
}

export type User = {
    id: string
    address: string
    userName: string
    email: string
    coins: number
    aurium: number
}

export function SigninDropdown({
                                   disabled,
                                   handleLogin,
                                   handleConnect,
                               }: SigninDropdownProps) {
    const [email, setEmail] = useState("quentin@cometh.io")
    const [password, setPassword] = useState("Password1")
    const [signinButton, setSigninButton] = useState("Login")
    const [walletsRendered, setWalletsRendered] = useState(false)
    const {initOnboard, onboard, initNewSignerRequest, retrieveWalletAddressFromSigner} = useWeb3OnboardContext()
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (!currentUser) {
            const userString = localStorage.getItem('user');
            if (userString) {
                const user: User = JSON.parse(userString);
                setSigninButton(user?.userName);
                setWalletsRendered(true);
                setCurrentUser(user);
            }
        }
    }, [currentUser]);


    const handleLogout = () => {
        localStorage.removeItem('user');
        setSigninButton("Sign in");
        setWalletsRendered(false);
    }

    const handleProfile = () => {
        if (currentUser) {
            const profileUrl = `http://localhost:3001/profile/${currentUser.address}`;
            window.location.href = profileUrl;
        }
    }

    const wallets = [
        ...(env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY
            ? [
                {
                    name: "Cometh",
                    icon: `${process.env.NEXT_PUBLIC_BASE_PATH}/icons/cometh-connect.png`,
                    isComethWallet: true,
                },
            ]
            : [])
    ]

    const handleModalOpen = () => {
        setIsModalOpen(false)
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        try {
            const response = await axios.post('https://api.develop.cosmikbattle.com/api/login', {
                    username: email,
                    password: password
                },
                {withCredentials: true}
            );

            if (response.data.success) {
                const user = response.data.user
                if (user.userName) {
                    setSigninButton(user.userName)
                    setWalletsRendered(true);
                    localStorage.setItem('user', JSON.stringify(user));
                }
                try {
                    // Check if user has already added this device
                    await retrieveWalletAddressFromSigner(user.address);
                } catch (error) {
                    console.log('Error retrieving wallet address from the signer', error);
                    setIsModalOpen(true)
                }
            } else {
                console.log('Login failed', response.data.errorKey);
            }
        } catch (error) {
            console.error('Error adding new device', error);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="default" disabled={disabled} isLoading={disabled}>
                    {signinButton}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" asChild>
                <Card className="p-4" style={{width: "324px"}}>
                    <CardHeader className="mb-3 p-0">
                        <CardTitle className="text-xl">Connect</CardTitle>
                    </CardHeader>
                    {!walletsRendered && (
                        <CardContent className="space-y-3 p-0">
                            <form onSubmit={handleSubmit}>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                />
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                                <Button className="mt-2" type="submit">Login</Button>
                            </form>
                        </CardContent>
                    )}
                    <div className="flex flex-col justify-between mb-4 gap-4">
                    {walletsRendered && (
                        <>
                        <Button onClick={handleProfile}>Profile</Button>
                        <Button onClick={handleLogout}>Logout</Button>
                        </>
                    )}
                    {isModalOpen && (
                        <AddNewDeviceDialog setIsOpen={setIsModalOpen} onClose={handleModalOpen}></AddNewDeviceDialog>
                    )}
                    </div>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// export type SigninDropdownProps = {
//   disabled: boolean
//   handleConnect?: (isComethWallet: boolean) => Promise<void>
//   fullVariant?: boolean
// }
//
// export function SigninDropdown({
//   disabled,
//   handleConnect,
//   fullVariant
// }: SigninDropdownProps) {
//   const wallets = [
//     ...(env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY
//       ? [
//           {
//             name: "Cometh",
//             icon: `${process.env.NEXT_PUBLIC_BASE_PATH}/icons/cometh-connect.png`,
//             isComethWallet: true,
//           },
//         ]
//       : []),
//     {
//       name: "Metamask",
//       icon: `${process.env.NEXT_PUBLIC_BASE_PATH}/icons/metamask.svg`,
//       isComethWallet: false,
//     },
//   ]
//
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           className={cx({
//             "w-full h-12": fullVariant,
//           })}
//           variant="default"
//           disabled={disabled}
//           isLoading={disabled}
//         >
//           <WalletIcon size="16" className="mr-2" />
//           Login
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" asChild>
//         <Card className="p-4" style={{ width: "324px" }}>
//           <CardHeader className="mb-3 p-0">
//             <CardTitle className="text-xl">Login</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3 p-0">
//             {wallets.map((wallet) => (
//               <AccountWallet
//                 key={wallet.name}
//                 name={wallet.name}
//                 icon={wallet.icon}
//                 isComethWallet={wallet.isComethWallet}
//                 handleConnect={handleConnect}
//               />
//             ))}
//           </CardContent>
//         </Card>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }