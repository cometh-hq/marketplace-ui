"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { AccountWallet } from "./account-wallet"
import {env} from "@/config/env";
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
    const [password, setPassword] = useState("Superlaser42")
    const [signinButton, setSigninButton] = useState("Sign in")
    const [walletsRendered, setWalletsRendered] = useState(false)
    const { initOnboard, onboard, initNewSignerRequest, retrieveWalletAddressFromSigner } = useWeb3OnboardContext()
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (!currentUser){
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
            const response = await axios.post('http://localhost:3000/api/login', {
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
                }
                catch (error) {
                    setIsModalOpen(true)
                    // await initNewSignerRequest(user.address)
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
                <Card className="p-4" style={{ width: "324px" }}>
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
                    {walletsRendered && (
                        <Button onClick={handleLogout}>Logout</Button>
                    )}
                    {isModalOpen && (
                    <AddNewDeviceDialog setIsOpen={setIsModalOpen} onClose={handleModalOpen}></AddNewDeviceDialog>
                    )}
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
