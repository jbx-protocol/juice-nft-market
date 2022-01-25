/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface ITerminalInterface extends utils.Interface {
  contractName: "ITerminal";
  functions: {
    "addToBalance(uint256)": FunctionFragment;
    "allowMigration(address)": FunctionFragment;
    "migrate(uint256,address)": FunctionFragment;
    "migrationIsAllowed(address)": FunctionFragment;
    "pay(uint256,address,string,bool)": FunctionFragment;
    "terminalDirectory()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addToBalance",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "allowMigration",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "migrate",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "migrationIsAllowed",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "pay",
    values: [BigNumberish, string, string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "terminalDirectory",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "addToBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "allowMigration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "migrate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "migrationIsAllowed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "pay", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "terminalDirectory",
    data: BytesLike
  ): Result;

  events: {
    "AddToBalance(uint256,uint256,address)": EventFragment;
    "AllowMigration(address)": EventFragment;
    "Migrate(uint256,address,uint256,address)": EventFragment;
    "Pay(uint256,uint256,address,uint256,string,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AddToBalance"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AllowMigration"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Migrate"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Pay"): EventFragment;
}

export type AddToBalanceEvent = TypedEvent<
  [BigNumber, BigNumber, string],
  { projectId: BigNumber; value: BigNumber; caller: string }
>;

export type AddToBalanceEventFilter = TypedEventFilter<AddToBalanceEvent>;

export type AllowMigrationEvent = TypedEvent<[string], { allowed: string }>;

export type AllowMigrationEventFilter = TypedEventFilter<AllowMigrationEvent>;

export type MigrateEvent = TypedEvent<
  [BigNumber, string, BigNumber, string],
  { projectId: BigNumber; to: string; _amount: BigNumber; caller: string }
>;

export type MigrateEventFilter = TypedEventFilter<MigrateEvent>;

export type PayEvent = TypedEvent<
  [BigNumber, BigNumber, string, BigNumber, string, string],
  {
    fundingCycleId: BigNumber;
    projectId: BigNumber;
    beneficiary: string;
    amount: BigNumber;
    note: string;
    caller: string;
  }
>;

export type PayEventFilter = TypedEventFilter<PayEvent>;

export interface ITerminal extends BaseContract {
  contractName: "ITerminal";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ITerminalInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addToBalance(
      _projectId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    allowMigration(
      _contract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    migrate(
      _projectId: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    migrationIsAllowed(
      _terminal: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    pay(
      _projectId: BigNumberish,
      _beneficiary: string,
      _memo: string,
      _preferUnstakedTickets: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    terminalDirectory(overrides?: CallOverrides): Promise<[string]>;
  };

  addToBalance(
    _projectId: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  allowMigration(
    _contract: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  migrate(
    _projectId: BigNumberish,
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  migrationIsAllowed(
    _terminal: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  pay(
    _projectId: BigNumberish,
    _beneficiary: string,
    _memo: string,
    _preferUnstakedTickets: boolean,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  terminalDirectory(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    addToBalance(
      _projectId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    allowMigration(_contract: string, overrides?: CallOverrides): Promise<void>;

    migrate(
      _projectId: BigNumberish,
      _to: string,
      overrides?: CallOverrides
    ): Promise<void>;

    migrationIsAllowed(
      _terminal: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    pay(
      _projectId: BigNumberish,
      _beneficiary: string,
      _memo: string,
      _preferUnstakedTickets: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    terminalDirectory(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "AddToBalance(uint256,uint256,address)"(
      projectId?: BigNumberish | null,
      value?: null,
      caller?: null
    ): AddToBalanceEventFilter;
    AddToBalance(
      projectId?: BigNumberish | null,
      value?: null,
      caller?: null
    ): AddToBalanceEventFilter;

    "AllowMigration(address)"(allowed?: null): AllowMigrationEventFilter;
    AllowMigration(allowed?: null): AllowMigrationEventFilter;

    "Migrate(uint256,address,uint256,address)"(
      projectId?: BigNumberish | null,
      to?: string | null,
      _amount?: null,
      caller?: null
    ): MigrateEventFilter;
    Migrate(
      projectId?: BigNumberish | null,
      to?: string | null,
      _amount?: null,
      caller?: null
    ): MigrateEventFilter;

    "Pay(uint256,uint256,address,uint256,string,address)"(
      fundingCycleId?: BigNumberish | null,
      projectId?: BigNumberish | null,
      beneficiary?: string | null,
      amount?: null,
      note?: null,
      caller?: null
    ): PayEventFilter;
    Pay(
      fundingCycleId?: BigNumberish | null,
      projectId?: BigNumberish | null,
      beneficiary?: string | null,
      amount?: null,
      note?: null,
      caller?: null
    ): PayEventFilter;
  };

  estimateGas: {
    addToBalance(
      _projectId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    allowMigration(
      _contract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    migrate(
      _projectId: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    migrationIsAllowed(
      _terminal: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pay(
      _projectId: BigNumberish,
      _beneficiary: string,
      _memo: string,
      _preferUnstakedTickets: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    terminalDirectory(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    addToBalance(
      _projectId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    allowMigration(
      _contract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    migrate(
      _projectId: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    migrationIsAllowed(
      _terminal: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pay(
      _projectId: BigNumberish,
      _beneficiary: string,
      _memo: string,
      _preferUnstakedTickets: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    terminalDirectory(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}