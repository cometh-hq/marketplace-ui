/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers'
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from '@ethersproject/abi'
import type { Listener, Provider } from '@ethersproject/providers'
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from '../common'

export declare namespace IRentalProtocol {
  export type NFTStruct = {
    token: string
    tokenId: BigNumberish
    duration: BigNumberish
    basisPoints: BigNumberish
  }

  export type NFTStructOutput = [string, BigNumber, BigNumber, number] & {
    token: string
    tokenId: BigNumber
    duration: BigNumber
    basisPoints: number
  }

  export type FeeStruct = { to: string; basisPoints: BigNumberish }

  export type FeeStructOutput = [string, BigNumber] & {
    to: string
    basisPoints: BigNumber
  }

  export type RentalOfferStruct = {
    maker: string
    taker: string
    nfts: IRentalProtocol.NFTStruct[]
    feeToken: string
    feeAmount: BigNumberish
    nonce: BigNumberish
    deadline: BigNumberish
  }

  export type RentalOfferStructOutput = [
    string,
    string,
    IRentalProtocol.NFTStructOutput[],
    string,
    BigNumber,
    BigNumber,
    BigNumber,
  ] & {
    maker: string
    taker: string
    nfts: IRentalProtocol.NFTStructOutput[]
    feeToken: string
    feeAmount: BigNumber
    nonce: BigNumber
    deadline: BigNumber
  }
}

export interface IRentalProtocolInterface extends utils.Interface {
  functions: {
    'cancelRentalOffer(uint256)': FunctionFragment
    'endRental(address,uint256)': FunctionFragment
    'endRentalPrematurely(address,uint256)': FunctionFragment
    'endSublet(address,uint256)': FunctionFragment
    'getFeesTable(address,uint256)': FunctionFragment
    'preSignRentalOffer((address,address,(address,uint256,uint64,uint16)[],address,uint256,uint256,uint256))': FunctionFragment
    'rent((address,address,(address,uint256,uint64,uint16)[],address,uint256,uint256,uint256),uint8,bytes)': FunctionFragment
    'setFeesBasisPoints(uint16)': FunctionFragment
    'setFeesCollector(address)': FunctionFragment
    'sublet(address,uint256,address,uint16)': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic:
      | 'cancelRentalOffer'
      | 'endRental'
      | 'endRentalPrematurely'
      | 'endSublet'
      | 'getFeesTable'
      | 'preSignRentalOffer'
      | 'rent'
      | 'setFeesBasisPoints'
      | 'setFeesCollector'
      | 'sublet',
  ): FunctionFragment

  encodeFunctionData(
    functionFragment: 'cancelRentalOffer',
    values: [BigNumberish],
  ): string
  encodeFunctionData(
    functionFragment: 'endRental',
    values: [string, BigNumberish],
  ): string
  encodeFunctionData(
    functionFragment: 'endRentalPrematurely',
    values: [string, BigNumberish],
  ): string
  encodeFunctionData(
    functionFragment: 'endSublet',
    values: [string, BigNumberish],
  ): string
  encodeFunctionData(
    functionFragment: 'getFeesTable',
    values: [string, BigNumberish],
  ): string
  encodeFunctionData(
    functionFragment: 'preSignRentalOffer',
    values: [IRentalProtocol.RentalOfferStruct],
  ): string
  encodeFunctionData(
    functionFragment: 'rent',
    values: [IRentalProtocol.RentalOfferStruct, BigNumberish, BytesLike],
  ): string
  encodeFunctionData(
    functionFragment: 'setFeesBasisPoints',
    values: [BigNumberish],
  ): string
  encodeFunctionData(
    functionFragment: 'setFeesCollector',
    values: [string],
  ): string
  encodeFunctionData(
    functionFragment: 'sublet',
    values: [string, BigNumberish, string, BigNumberish],
  ): string

  decodeFunctionResult(
    functionFragment: 'cancelRentalOffer',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'endRental', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'endRentalPrematurely',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'endSublet', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'getFeesTable',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'preSignRentalOffer',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'rent', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'setFeesBasisPoints',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'setFeesCollector',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'sublet', data: BytesLike): Result

  events: {
    'AssociatedNFTs(address,address,address,address)': EventFragment
    'FeesBasisPointsChanged(uint16)': EventFragment
    'FeesCollectorChanged(address)': EventFragment
    'RentalEnded(address,address,address,uint256)': EventFragment
    'RentalOfferCancelled(uint256,address)': EventFragment
    'RentalOfferCreated(uint256,address,address,tuple[],address,uint256,uint256)': EventFragment
    'RentalStarted(uint256,address,address,address,uint256,uint64,uint16,uint256,uint256)': EventFragment
    'RequestToEndRentalPrematurely(address,address,uint256)': EventFragment
    'SubletEnded(address,address,address,uint256)': EventFragment
    'SubletStarted(address,address,address,uint256,uint16)': EventFragment
  }

  getEvent(nameOrSignatureOrTopic: 'AssociatedNFTs'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'FeesBasisPointsChanged'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'FeesCollectorChanged'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'RentalEnded'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'RentalOfferCancelled'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'RentalOfferCreated'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'RentalStarted'): EventFragment
  getEvent(
    nameOrSignatureOrTopic: 'RequestToEndRentalPrematurely',
  ): EventFragment
  getEvent(nameOrSignatureOrTopic: 'SubletEnded'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'SubletStarted'): EventFragment
}

export interface AssociatedNFTsEventObject {
  originalNFT: string
  lentNFT: string
  borrowedNFT: string
  subLentNFT: string
}
export type AssociatedNFTsEvent = TypedEvent<
  [string, string, string, string],
  AssociatedNFTsEventObject
>

export type AssociatedNFTsEventFilter = TypedEventFilter<AssociatedNFTsEvent>

export interface FeesBasisPointsChangedEventObject {
  basisPoints: number
}
export type FeesBasisPointsChangedEvent = TypedEvent<
  [number],
  FeesBasisPointsChangedEventObject
>

export type FeesBasisPointsChangedEventFilter =
  TypedEventFilter<FeesBasisPointsChangedEvent>

export interface FeesCollectorChangedEventObject {
  feeCollector: string
}
export type FeesCollectorChangedEvent = TypedEvent<
  [string],
  FeesCollectorChangedEventObject
>

export type FeesCollectorChangedEventFilter =
  TypedEventFilter<FeesCollectorChangedEvent>

export interface RentalEndedEventObject {
  lender: string
  tenant: string
  token: string
  tokenId: BigNumber
}
export type RentalEndedEvent = TypedEvent<
  [string, string, string, BigNumber],
  RentalEndedEventObject
>

export type RentalEndedEventFilter = TypedEventFilter<RentalEndedEvent>

export interface RentalOfferCancelledEventObject {
  nonce: BigNumber
  maker: string
}
export type RentalOfferCancelledEvent = TypedEvent<
  [BigNumber, string],
  RentalOfferCancelledEventObject
>

export type RentalOfferCancelledEventFilter =
  TypedEventFilter<RentalOfferCancelledEvent>

export interface RentalOfferCreatedEventObject {
  nonce: BigNumber
  maker: string
  taker: string
  nfts: IRentalProtocol.NFTStructOutput[]
  feeToken: string
  feeAmount: BigNumber
  deadline: BigNumber
}
export type RentalOfferCreatedEvent = TypedEvent<
  [
    BigNumber,
    string,
    string,
    IRentalProtocol.NFTStructOutput[],
    string,
    BigNumber,
    BigNumber,
  ],
  RentalOfferCreatedEventObject
>

export type RentalOfferCreatedEventFilter =
  TypedEventFilter<RentalOfferCreatedEvent>

export interface RentalStartedEventObject {
  nonce: BigNumber
  lender: string
  tenant: string
  token: string
  tokenId: BigNumber
  duration: BigNumber
  basisPoints: number
  start: BigNumber
  end: BigNumber
}
export type RentalStartedEvent = TypedEvent<
  [
    BigNumber,
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    number,
    BigNumber,
    BigNumber,
  ],
  RentalStartedEventObject
>

export type RentalStartedEventFilter = TypedEventFilter<RentalStartedEvent>

export interface RequestToEndRentalPrematurelyEventObject {
  requester: string
  token: string
  tokenId: BigNumber
}
export type RequestToEndRentalPrematurelyEvent = TypedEvent<
  [string, string, BigNumber],
  RequestToEndRentalPrematurelyEventObject
>

export type RequestToEndRentalPrematurelyEventFilter =
  TypedEventFilter<RequestToEndRentalPrematurelyEvent>

export interface SubletEndedEventObject {
  lender: string
  tenant: string
  token: string
  tokenId: BigNumber
}
export type SubletEndedEvent = TypedEvent<
  [string, string, string, BigNumber],
  SubletEndedEventObject
>

export type SubletEndedEventFilter = TypedEventFilter<SubletEndedEvent>

export interface SubletStartedEventObject {
  lender: string
  tenant: string
  token: string
  tokenId: BigNumber
  basisPoints: number
}
export type SubletStartedEvent = TypedEvent<
  [string, string, string, BigNumber, number],
  SubletStartedEventObject
>

export type SubletStartedEventFilter = TypedEventFilter<SubletStartedEvent>

export interface IRentalProtocol extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: IRentalProtocolInterface

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>,
  ): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>,
  ): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>

  functions: {
    cancelRentalOffer(
      nonce: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    endRental(
      token: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    endRentalPrematurely(
      token: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    endSublet(
      token: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    getFeesTable(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[IRentalProtocol.FeeStructOutput[]]>

    preSignRentalOffer(
      offer: IRentalProtocol.RentalOfferStruct,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    rent(
      offer: IRentalProtocol.RentalOfferStruct,
      signatureType: BigNumberish,
      signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    setFeesBasisPoints(
      basisPoints: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    setFeesCollector(
      feesCollector: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    sublet(
      token: string,
      tokenId: BigNumberish,
      subtenant: string,
      basisPoints: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>
  }

  cancelRentalOffer(
    nonce: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  endRental(
    token: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  endRentalPrematurely(
    token: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  endSublet(
    token: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  getFeesTable(
    token: string,
    tokenId: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<IRentalProtocol.FeeStructOutput[]>

  preSignRentalOffer(
    offer: IRentalProtocol.RentalOfferStruct,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  rent(
    offer: IRentalProtocol.RentalOfferStruct,
    signatureType: BigNumberish,
    signature: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  setFeesBasisPoints(
    basisPoints: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  setFeesCollector(
    feesCollector: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  sublet(
    token: string,
    tokenId: BigNumberish,
    subtenant: string,
    basisPoints: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  callStatic: {
    cancelRentalOffer(
      nonce: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>

    endRental(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>

    endRentalPrematurely(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>

    endSublet(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>

    getFeesTable(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<IRentalProtocol.FeeStructOutput[]>

    preSignRentalOffer(
      offer: IRentalProtocol.RentalOfferStruct,
      overrides?: CallOverrides,
    ): Promise<void>

    rent(
      offer: IRentalProtocol.RentalOfferStruct,
      signatureType: BigNumberish,
      signature: BytesLike,
      overrides?: CallOverrides,
    ): Promise<void>

    setFeesBasisPoints(
      basisPoints: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>

    setFeesCollector(
      feesCollector: string,
      overrides?: CallOverrides,
    ): Promise<void>

    sublet(
      token: string,
      tokenId: BigNumberish,
      subtenant: string,
      basisPoints: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>
  }

  filters: {
    'AssociatedNFTs(address,address,address,address)'(
      originalNFT?: null,
      lentNFT?: null,
      borrowedNFT?: null,
      subLentNFT?: null,
    ): AssociatedNFTsEventFilter
    AssociatedNFTs(
      originalNFT?: null,
      lentNFT?: null,
      borrowedNFT?: null,
      subLentNFT?: null,
    ): AssociatedNFTsEventFilter

    'FeesBasisPointsChanged(uint16)'(
      basisPoints?: null,
    ): FeesBasisPointsChangedEventFilter
    FeesBasisPointsChanged(
      basisPoints?: null,
    ): FeesBasisPointsChangedEventFilter

    'FeesCollectorChanged(address)'(
      feeCollector?: null,
    ): FeesCollectorChangedEventFilter
    FeesCollectorChanged(feeCollector?: null): FeesCollectorChangedEventFilter

    'RentalEnded(address,address,address,uint256)'(
      lender?: string | null,
      tenant?: string | null,
      token?: null,
      tokenId?: null,
    ): RentalEndedEventFilter
    RentalEnded(
      lender?: string | null,
      tenant?: string | null,
      token?: null,
      tokenId?: null,
    ): RentalEndedEventFilter

    'RentalOfferCancelled(uint256,address)'(
      nonce?: BigNumberish | null,
      maker?: string | null,
    ): RentalOfferCancelledEventFilter
    RentalOfferCancelled(
      nonce?: BigNumberish | null,
      maker?: string | null,
    ): RentalOfferCancelledEventFilter

    'RentalOfferCreated(uint256,address,address,tuple[],address,uint256,uint256)'(
      nonce?: BigNumberish | null,
      maker?: string | null,
      taker?: null,
      nfts?: null,
      feeToken?: null,
      feeAmount?: null,
      deadline?: null,
    ): RentalOfferCreatedEventFilter
    RentalOfferCreated(
      nonce?: BigNumberish | null,
      maker?: string | null,
      taker?: null,
      nfts?: null,
      feeToken?: null,
      feeAmount?: null,
      deadline?: null,
    ): RentalOfferCreatedEventFilter

    'RentalStarted(uint256,address,address,address,uint256,uint64,uint16,uint256,uint256)'(
      nonce?: BigNumberish | null,
      lender?: string | null,
      tenant?: string | null,
      token?: null,
      tokenId?: null,
      duration?: null,
      basisPoints?: null,
      start?: null,
      end?: null,
    ): RentalStartedEventFilter
    RentalStarted(
      nonce?: BigNumberish | null,
      lender?: string | null,
      tenant?: string | null,
      token?: null,
      tokenId?: null,
      duration?: null,
      basisPoints?: null,
      start?: null,
      end?: null,
    ): RentalStartedEventFilter

    'RequestToEndRentalPrematurely(address,address,uint256)'(
      requester?: string | null,
      token?: string | null,
      tokenId?: BigNumberish | null,
    ): RequestToEndRentalPrematurelyEventFilter
    RequestToEndRentalPrematurely(
      requester?: string | null,
      token?: string | null,
      tokenId?: BigNumberish | null,
    ): RequestToEndRentalPrematurelyEventFilter

    'SubletEnded(address,address,address,uint256)'(
      lender?: string | null,
      tenant?: string | null,
      token?: null,
      tokenId?: null,
    ): SubletEndedEventFilter
    SubletEnded(
      lender?: string | null,
      tenant?: string | null,
      token?: null,
      tokenId?: null,
    ): SubletEndedEventFilter

    'SubletStarted(address,address,address,uint256,uint16)'(
      lender?: string | null,
      tenant?: string | null,
      token?: null,
      tokenId?: null,
      basisPoints?: null,
    ): SubletStartedEventFilter
    SubletStarted(
      lender?: string | null,
      tenant?: string | null,
      token?: null,
      tokenId?: null,
      basisPoints?: null,
    ): SubletStartedEventFilter
  }

  estimateGas: {
    cancelRentalOffer(
      nonce: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    endRental(
      token: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    endRentalPrematurely(
      token: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    endSublet(
      token: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    getFeesTable(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    preSignRentalOffer(
      offer: IRentalProtocol.RentalOfferStruct,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    rent(
      offer: IRentalProtocol.RentalOfferStruct,
      signatureType: BigNumberish,
      signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    setFeesBasisPoints(
      basisPoints: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    setFeesCollector(
      feesCollector: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    sublet(
      token: string,
      tokenId: BigNumberish,
      subtenant: string,
      basisPoints: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>
  }

  populateTransaction: {
    cancelRentalOffer(
      nonce: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    endRental(
      token: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    endRentalPrematurely(
      token: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    endSublet(
      token: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    getFeesTable(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    preSignRentalOffer(
      offer: IRentalProtocol.RentalOfferStruct,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    rent(
      offer: IRentalProtocol.RentalOfferStruct,
      signatureType: BigNumberish,
      signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    setFeesBasisPoints(
      basisPoints: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    setFeesCollector(
      feesCollector: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    sublet(
      token: string,
      tokenId: BigNumberish,
      subtenant: string,
      basisPoints: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>
  }
}
