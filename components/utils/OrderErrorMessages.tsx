import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { formatUnits } from "ethers/lib/utils"

import {
  ValidateBuyOfferResult,
  ValidateSellListingResult,
} from "@/lib/web3/flows/validateOrder"

type ValidationResult = ValidateBuyOfferResult | ValidateSellListingResult

export const generateErrorMessages = (
  validationResult: ValidationResult,
  order?: OrderWithAsset
) => {
  let title = ""
  let message = ""

  if (
    "hasApprovedCollection" in validationResult &&
    !validationResult.hasApprovedCollection
  ) {
    title = "Approval Required"
    message =
      "The maker of the offer has not granted the necessary approval for this collection. Only the maker can approve the required collection to proceed with this transaction."
  }
  if (
    "quantity" in validationResult &&
    order &&
    parseInt(validationResult.quantity) <
      parseInt(order.tokenQuantityRemaining)
  ) {
    title = "Insufficient Asset"
    message =
      "The maker of the offer does not have enough assets in their balance to fulfill the offer. The transaction can only proceed if the maker ensures sufficient assets are available."
  }
  if (
    "missingBalance" in validationResult &&
    validationResult.missingBalance &&
    !validationResult.missingBalance.isZero()
  ) {
    const missingBalanceValue = formatUnits(validationResult.missingBalance)
    title = "Insufficient Funds"
    message = `The offer cannot be accepted because the maker of the offer does not have enough MATIC in their balance. The transaction can only proceed if the maker ensures sufficient funds ${missingBalanceValue} MATIC are available.`
  }
  if ("allowance" in validationResult && validationResult.allowance) {
    title = "Allowance Required"
    message =
      "The transaction cannot proceed because the maker of the offer has not granted the necessary allowance for their tokens. Only the maker can approve the required tokens to continue with this transaction."
  }

  return { title, message }
}
