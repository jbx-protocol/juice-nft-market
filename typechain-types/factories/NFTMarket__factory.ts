/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { NFTMarket, NFTMarketInterface } from "../NFTMarket";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract ITerminalDirectory",
        name: "_terminalDirectory",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "BeneficiaryIsZero",
    type: "error",
  },
  {
    inputs: [],
    name: "IncorrectAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "NoRecipients",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "prod1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "denominator",
        type: "uint256",
      },
    ],
    name: "PRBMath__MulDivOverflow",
    type: "error",
  },
  {
    inputs: [],
    name: "PercentExceeded",
    type: "error",
  },
  {
    inputs: [],
    name: "PercentNot100",
    type: "error",
  },
  {
    inputs: [],
    name: "RecipientPercentZero",
    type: "error",
  },
  {
    inputs: [],
    name: "TerminalNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "Unapproved",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract IERC721",
        name: "_contract",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "Delisted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract IERC721",
        name: "_contract",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "preferUnstaked",
            type: "bool",
          },
          {
            internalType: "uint16",
            name: "percent",
            type: "uint16",
          },
          {
            internalType: "address payable",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "string",
            name: "memo",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "projectId",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct SaleRecipient[]",
        name: "_recipients",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "Listed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract IERC721",
        name: "_contract",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "Purchased",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "contract IERC721",
        name: "_contract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "delist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC721",
        name: "_contract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "preferUnstaked",
            type: "bool",
          },
          {
            internalType: "uint16",
            name: "percent",
            type: "uint16",
          },
          {
            internalType: "address payable",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "string",
            name: "memo",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "projectId",
            type: "uint256",
          },
        ],
        internalType: "struct SaleRecipient[]",
        name: "_recipients",
        type: "tuple[]",
      },
    ],
    name: "list",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC721",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "prices",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC721",
        name: "_contract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "purchase",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "contract IERC721",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "recipientsOf",
    outputs: [
      {
        internalType: "bool",
        name: "preferUnstaked",
        type: "bool",
      },
      {
        internalType: "uint16",
        name: "percent",
        type: "uint16",
      },
      {
        internalType: "address payable",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "string",
        name: "memo",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "terminalDirectory",
    outputs: [
      {
        internalType: "contract ITerminalDirectory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b50604051620023e5380380620023e58339810160408190526100319161004b565b600160005560601b6001600160601b03191660805261007b565b60006020828403121561005d57600080fd5b81516001600160a01b038116811461007457600080fd5b9392505050565b60805160601c612344620000a1600039600081816101240152610fca01526123446000f3fe6080604052600436106100705760003560e01c8063a917c9101161004e578063a917c9101461016b578063bbc492c01461019c578063e3784066146101e2578063f074258e146101f557600080fd5b8063150b7a02146100755780633dfedf07146100f05780636abcf8e314610112575b600080fd5b34801561008157600080fd5b506100ba610090366004611c4b565b7f150b7a020000000000000000000000000000000000000000000000000000000095945050505050565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020015b60405180910390f35b3480156100fc57600080fd5b5061011061010b366004611dbb565b610215565b005b34801561011e57600080fd5b506101467f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100e7565b34801561017757600080fd5b5061018b610186366004611cea565b610b9e565b6040516100e7959493929190612075565b3480156101a857600080fd5b506101d46101b7366004611d4d565b600260209081526000928352604080842090915290825290205481565b6040519081526020016100e7565b6101106101f0366004611d79565b610cb0565b34801561020157600080fd5b50610110610210366004611d4d565b61133d565b60026000541415610287576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064015b60405180910390fd5b60026000556040517f6352211e00000000000000000000000000000000000000000000000000000000815260048101849052339073ffffffffffffffffffffffffffffffffffffffff861690636352211e9060240160206040518083038186803b1580156102f457600080fd5b505afa158015610308573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061032c9190611c2e565b73ffffffffffffffffffffffffffffffffffffffff161415801561040457506040517f081812fc00000000000000000000000000000000000000000000000000000000815260048101849052339073ffffffffffffffffffffffffffffffffffffffff86169063081812fc9060240160206040518083038186803b1580156103b357600080fd5b505afa1580156103c7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103eb9190611c2e565b73ffffffffffffffffffffffffffffffffffffffff1614155b801561055557506040517f6352211e0000000000000000000000000000000000000000000000000000000081526004810184905273ffffffffffffffffffffffffffffffffffffffff85169063e985e9c5908290636352211e9060240160206040518083038186803b15801561047957600080fd5b505afa15801561048d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104b19190611c2e565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e084901b16815273ffffffffffffffffffffffffffffffffffffffff909116600482015233602482015260440160206040518083038186803b15801561051b57600080fd5b505afa15801561052f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105539190611d30565b155b1561058c576040517f91a7df1a00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040517f081812fc00000000000000000000000000000000000000000000000000000000815260048101849052309073ffffffffffffffffffffffffffffffffffffffff86169063081812fc9060240160206040518083038186803b1580156105f457600080fd5b505afa158015610608573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062c9190611c2e565b73ffffffffffffffffffffffffffffffffffffffff161415801561079557506040517f6352211e0000000000000000000000000000000000000000000000000000000081526004810184905273ffffffffffffffffffffffffffffffffffffffff85169063e985e9c5908290636352211e9060240160206040518083038186803b1580156106b957600080fd5b505afa1580156106cd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106f19190611c2e565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e084901b16815273ffffffffffffffffffffffffffffffffffffffff909116600482015230602482015260440160206040518083038186803b15801561075b57600080fd5b505afa15801561076f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107939190611d30565b155b156107cc576040517f91a7df1a00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000815111610807576040517f91c0aaa200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805b8251811015610ae457600083828151811061082857610828612280565b60200260200101516020015161ffff161161086f576040517f1e4b4aa200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b82818151811061088157610881612280565b60200260200101516020015161ffff168261089c919061217d565b91506127108211156108da576040517f71a7f2dd00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8281815181106108ec576108ec612280565b60200260200101516080015160001480156109505750600073ffffffffffffffffffffffffffffffffffffffff1683828151811061092c5761092c612280565b60200260200101516040015173ffffffffffffffffffffffffffffffffffffffff16145b15610987576040517fc0f3343500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b33600090815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8a1684528252808320888452909152902083518490839081106109d3576109d3612280565b6020908102919091018101518254600181810185556000948552938390208251600390920201805483850151604085015173ffffffffffffffffffffffffffffffffffffffff166301000000027fffffffffffffffffff0000000000000000000000000000000000000000ffffff61ffff909216610100027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000ff951515959095167fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000009093169290921793909317929092169190911781556060820151805192949193610ac49392850192910190611a6d565b506080820151816002015550508080610adc906121e9565b91505061080b565b508061271014610b20576040517fda07043d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff85166000818152600260209081526040808320888452909152908190208590555185919033907fde226c796648f37059a7e7b7ccad8c5e6948b389ef43b6f963539f770653eaa590610b8a9087908990611f9e565b60405180910390a450506001600055505050565b60016020528360005260406000206020528260005260406000206020528160005260406000208181548110610bd257600080fd5b60009182526020909120600390910201805460018201805460ff83169750610100830461ffff169650630100000090920473ffffffffffffffffffffffffffffffffffffffff169450919250610c2790612195565b80601f0160208091040260200160405190810160405280929190818152602001828054610c5390612195565b8015610ca05780601f10610c7557610100808354040283529160200191610ca0565b820191906000526020600020905b815481529060010190602001808311610c8357829003601f168201915b5050505050908060020154905085565b60026000541415610d1d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161027e565b6002600081815573ffffffffffffffffffffffffffffffffffffffff851681526020918252604080822085835290925220543414610d87576040517f69640e7200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff80821660009081526001602090815260408083209387168352928152828220858352815282822080548451818402810184019095528085529293929091849084015b82821015610ef15760008481526020908190206040805160a08101825260038602909201805460ff811615158452610100810461ffff1694840194909452630100000090930473ffffffffffffffffffffffffffffffffffffffff1690820152600182018054919291606084019190610e5690612195565b80601f0160208091040260200160405190810160405280929190818152602001828054610e8290612195565b8015610ecf5780601f10610ea457610100808354040283529160200191610ecf565b820191906000526020600020905b815481529060010190602001808311610eb257829003601f168201915b5050505050815260200160028201548152505081526020019060010190610dde565b5050505090506000815111610f32576040517f91c0aaa200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60005b815181101561120c576000828281518110610f5257610f52612280565b602002602001015190506000610f7334836020015161ffff166127106116eb565b905080156111f7576080820151156111e95760808201516040517f4fe0eced00000000000000000000000000000000000000000000000000000000815260009173ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001691634fe0eced916110019160040190815260200190565b60206040518083038186803b15801561101957600080fd5b505afa15801561102d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110519190611c2e565b905061105c816117f6565b61109a6040518060400160405280600681526020017f737472696e67000000000000000000000000000000000000000000000000000081525061187c565b73ffffffffffffffffffffffffffffffffffffffff81166110e7576040517f4df1ff9800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff166302c8986f838560800151600073ffffffffffffffffffffffffffffffffffffffff16876040015173ffffffffffffffffffffffffffffffffffffffff161461114b57866040015161114d565b335b606088015188516040517fffffffff0000000000000000000000000000000000000000000000000000000060e088901b16815261119094939291906004016120db565b6020604051808303818588803b1580156111a957600080fd5b505af11580156111bd573d6000803e3d6000fd5b50505050506040513d601f19601f820116820180604052508101906111e29190611f38565b50506111f7565b6111f78260400151826118ed565b50508080611204906121e9565b915050610f35565b506040517f42842e0e0000000000000000000000000000000000000000000000000000000081523060048201523360248201526044810184905273ffffffffffffffffffffffffffffffffffffffff8516906342842e0e90606401600060405180830381600087803b15801561128157600080fd5b505af1158015611295573d6000803e3d6000fd5b5050505073ffffffffffffffffffffffffffffffffffffffff8281166000908152600160209081526040808320938816835292815282822086835290529081206112de91611af1565b60408051308152346020820152849173ffffffffffffffffffffffffffffffffffffffff87169133917f10489d00e99dad847cfdaebcd4f071ab10fb364134b113d0c9cdfbfeda19b126910160405180910390a4505060016000555050565b600260005414156113aa576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161027e565b6002600090815533815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff86168452825280832084845290915290205461141d576040517f91a7df1a00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040517f081812fc00000000000000000000000000000000000000000000000000000000815260048101829052309073ffffffffffffffffffffffffffffffffffffffff84169063081812fc9060240160206040518083038186803b15801561148557600080fd5b505afa158015611499573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114bd9190611c2e565b73ffffffffffffffffffffffffffffffffffffffff1614158061162557506040517f6352211e0000000000000000000000000000000000000000000000000000000081526004810182905273ffffffffffffffffffffffffffffffffffffffff83169063e985e9c5908290636352211e9060240160206040518083038186803b15801561154957600080fd5b505afa15801561155d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115819190611c2e565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e084901b16815273ffffffffffffffffffffffffffffffffffffffff909116600482015230602482015260440160206040518083038186803b1580156115eb57600080fd5b505afa1580156115ff573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116239190611d30565b155b1561165c576040517f91a7df1a00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b33600090815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff861684528252808320848452909152812061169d91611af1565b604051819073ffffffffffffffffffffffffffffffffffffffff84169033907ff88ef681ad3373210a8bdebc583f3b9caaf4f5eebba4acad2e758334bf6486e690600090a450506001600055565b600080807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff85870985870292508281108382030391505080600014156117445783828161173a5761173a612251565b04925050506117ef565b838110611787576040517f773cc18c000000000000000000000000000000000000000000000000000000008152600481018290526024810185905260440161027e565b600084868809851960019081018716968790049682860381900495909211909303600082900391909104909201919091029190911760038402600290811880860282030280860282030280860282030280860282030280860282030280860290910302029150505b9392505050565b60405173ffffffffffffffffffffffffffffffffffffffff821660248201526118799060440160408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f2c2ecbc200000000000000000000000000000000000000000000000000000000179052611a4c565b50565b6118798160405160240161189091906120c8565b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f41304fac00000000000000000000000000000000000000000000000000000000179052611a4c565b80471015611957576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e6365000000604482015260640161027e565b60008273ffffffffffffffffffffffffffffffffffffffff168260405160006040518083038185875af1925050503d80600081146119b1576040519150601f19603f3d011682016040523d82523d6000602084013e6119b6565b606091505b5050905080611a47576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d61792068617665207265766572746564000000000000606482015260840161027e565b505050565b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b828054611a7990612195565b90600052602060002090601f016020900481019282611a9b5760008555611ae1565b82601f10611ab457805160ff1916838001178555611ae1565b82800160010185558215611ae1579182015b82811115611ae1578251825591602001919060010190611ac6565b50611aed929150611b12565b5090565b50805460008255600302906000526020600020908101906118799190611b27565b5b80821115611aed5760008155600101611b13565b80821115611aed5780547fffffffffffffffffff00000000000000000000000000000000000000000000001681556000611b646001830182611b74565b5060006002820155600301611b27565b508054611b8090612195565b6000825580601f10611b90575050565b601f0160209004906000526020600020908101906118799190611b12565b8035611bb9816122de565b919050565b600082601f830112611bcf57600080fd5b813567ffffffffffffffff811115611be957611be96122af565b611bfc6020601f19601f8401160161214c565b818152846020838601011115611c1157600080fd5b816020850160208301376000918101602001919091529392505050565b600060208284031215611c4057600080fd5b81516117ef816122de565b600080600080600060808688031215611c6357600080fd5b8535611c6e816122de565b94506020860135611c7e816122de565b935060408601359250606086013567ffffffffffffffff80821115611ca257600080fd5b818801915088601f830112611cb657600080fd5b813581811115611cc557600080fd5b896020828501011115611cd757600080fd5b9699959850939650602001949392505050565b60008060008060808587031215611d0057600080fd5b8435611d0b816122de565b93506020850135611d1b816122de565b93969395505050506040820135916060013590565b600060208284031215611d4257600080fd5b81516117ef81612300565b60008060408385031215611d6057600080fd5b8235611d6b816122de565b946020939093013593505050565b600080600060608486031215611d8e57600080fd5b8335611d99816122de565b9250602084013591506040840135611db0816122de565b809150509250925092565b60008060008060808587031215611dd157600080fd5b611ddb85356122de565b84359350602085013592506040850135915067ffffffffffffffff8060608701351115611e0757600080fd5b6060860135860187601f820112611e1d57600080fd5b8181351115611e2e57611e2e6122af565b611e3e6020823560051b0161214c565b8082358252602082019150602083018a6020853560051b8601011115611e6357600080fd5b60005b8435811015611f26578582351115611e7d57600080fd5b8135850160a0601f19828f03011215611e9557600080fd5b611e9d612123565b611eaa6020830135612300565b60208201358152604082013561ffff81168114611ec657600080fd5b6020820152611ed760608301611bae565b60408201528760808301351115611eed57600080fd5b611f008e60206080850135850101611bbe565b606082015260a09190910135608082015284526020938401939190910190600101611e66565b50508094505050505092959194509250565b600060208284031215611f4a57600080fd5b5051919050565b6000815180845260005b81811015611f7757602081850181015186830182015201611f5b565b81811115611f89576000602083870101525b50601f01601f19169290920160200192915050565b60006040808301818452808651808352606092508286019150828160051b8701016020808a0160005b84811015612060577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa08a8503018652815160a081511515865261ffff85830151168587015273ffffffffffffffffffffffffffffffffffffffff8a830151168a87015288820151818a88015261203f82880182611f51565b60809384015197909301969096525095830195935090820190600101611fc7565b50509690960196909652509295945050505050565b851515815261ffff8516602082015273ffffffffffffffffffffffffffffffffffffffff8416604082015260a0606082015260006120b660a0830185611f51565b90508260808301529695505050505050565b6020815260006117ef6020830184611f51565b84815273ffffffffffffffffffffffffffffffffffffffff841660208201526080604082015260006121106080830185611f51565b9050821515606083015295945050505050565b60405160a0810167ffffffffffffffff81118282101715612146576121466122af565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715612175576121756122af565b604052919050565b6000821982111561219057612190612222565b500190565b600181811c908216806121a957607f821691505b602082108114156121e3577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561221b5761221b612222565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b73ffffffffffffffffffffffffffffffffffffffff8116811461187957600080fd5b801515811461187957600080fdfea26469706673582212209000597a4846502742ddabd3a8b1ad3997ca10102a46ab2aeb705afaf7b43ef764736f6c63430008060033";

type NFTMarketConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NFTMarketConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class NFTMarket__factory extends ContractFactory {
  constructor(...args: NFTMarketConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "NFTMarket";
  }

  deploy(
    _terminalDirectory: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<NFTMarket> {
    return super.deploy(
      _terminalDirectory,
      overrides || {}
    ) as Promise<NFTMarket>;
  }
  getDeployTransaction(
    _terminalDirectory: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_terminalDirectory, overrides || {});
  }
  attach(address: string): NFTMarket {
    return super.attach(address) as NFTMarket;
  }
  connect(signer: Signer): NFTMarket__factory {
    return super.connect(signer) as NFTMarket__factory;
  }
  static readonly contractName: "NFTMarket";
  public readonly contractName: "NFTMarket";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NFTMarketInterface {
    return new utils.Interface(_abi) as NFTMarketInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NFTMarket {
    return new Contract(address, _abi, signerOrProvider) as NFTMarket;
  }
}
