import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useWeb3OnboardContext } from "@/providers/web3-onboard";
import {User} from "@/components/account-dropdown/signin-dropdown";
import axios from "axios";

type AddNewDeviceDialogProps = {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onClose: () => void;
};

export function AddNewDeviceDialog({ setIsOpen, onClose }: AddNewDeviceDialogProps) {
    const { initOnboard, onboard, initNewSignerRequest, retrieveWalletAddressFromSigner } = useWeb3OnboardContext()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user: User = JSON.parse(userString);
            setUser(user);
        }
    }, []);

    const handleNewSignerRequest = async () => {
        try {
            const addSignerRequest = await initNewSignerRequest(user!.address);
            const response = await axios.post('http://localhost:3000/api/new-signer-request', addSignerRequest,
                {
                    withCredentials: true,
                });
            console.log("response", response);
        } catch (error) {
            console.error("Error", error);
            setIsOpen(false);
        }
    }

    return (
        <Dialog modal open onOpenChange={(v) => !v && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Device Detected</DialogTitle>
                </DialogHeader>

                <p>We need to access your biometric data to set up this device.</p>

                <Button
                    size="lg"
                    onClick={handleNewSignerRequest}
                >
                    Next
                </Button>
            </DialogContent>
        </Dialog>
    )
}

