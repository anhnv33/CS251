// =================== CS251 DEX Project =================== // 
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= // 

// sets up web3.js
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const exchange_name = 'HUST AMM'; // TODO: fill in the name of your exchange

const token_name = 'HUST';             // TODO: replace with name of your token
const token_symbol = 'HUST';               // TODO: replace with symbol for your token


// =============================================================================
//         ABIs and Contract Addresses: Paste Your ABIs/Addresses Here
// =============================================================================
// TODO: Paste your token contract address and ABI here:
const token_address = '0xd9145CCE52D386f254917e481eB44e9943F39138';

//read token_abi from token.json file
const token_abi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "initialSupply",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const token_contract = new web3.eth.Contract(token_abi, token_address);

// TODO: Paste your exchange address and ABI here
const exchange_abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenAmount",
                "type": "uint256"
            }
        ],
        "name": "addLiquidity",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_minTokens",
                "type": "uint256"
            }
        ],
        "name": "ethToTokenSwap",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_minTokens",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_recipient",
                "type": "address"
            }
        ],
        "name": "ethToTokenTransfer",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "factoryAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getETHReserve",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenSold",
                "type": "uint256"
            }
        ],
        "name": "getEthAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getReserve",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_ethSold",
                "type": "uint256"
            }
        ],
        "name": "getTokenAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "removeLiquidity",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokensSold",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minEth",
                "type": "uint256"
            }
        ],
        "name": "tokenToEthSwap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokensSold",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minTokensBought",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_tokenAddress",
                "type": "address"
            }
        ],
        "name": "tokenToTokenSwap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const exchange_address = '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B';
const exchange_contract = new web3.eth.Contract(exchange_abi, exchange_address);



// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the below functions

/*** INIT ***/
async function init() {
    var poolState = await getPoolState();
    if (poolState['token_liquidity'] === 0
        && poolState['eth_liquidity'] === 0) {
        // Call mint twice to make sure mint can be called mutliple times prior to disable_mint
        // const total_supply = 90;

        // try {
        //     await token_contract.methods._mint(total_supply / 2).send({from:web3.eth.defaultAccount, gas : 999999});
        //     await token_contract.methods._mint(total_supply / 2).send({from:web3.eth.defaultAccount, gas : 999999});
        // } catch (err) {
        //     console.log("Error calling mint: " + err);
        // }

        // await token_contract.methods._disable_mint().send({from:web3.eth.defaultAccount, gas : 999999});
        // await token_contract.methods.approve(exchange_address, total_supply).send({from:web3.eth.defaultAccount});
        // initialize pool with equal amounts of ETH and tokens, so exchange rate begins as 1:1
        // await exchange_contract.methods.createPool(total_supply).send({from:web3.eth.defaultAccount, value : total_supply, gas : 999999});

        // All accounts start with 0 of your tokens. Thus, be sure to swap before adding liquidity.
    }
}

async function getPoolState() {
    // read pool balance for each type of liquidity
    let liquidity_tokens = await exchange_contract.methods.getReserve().call({ from: web3.eth.defaultAccount });
    let liquidity_eth = await exchange_contract.methods.getETHReserve().call({ from: web3.eth.defaultAccount });
    let total_supply = await token_contract.methods.totalSupply().call({ from: web3.eth.defaultAccount });
    let current_balance = await token_contract.methods.balanceOf(web3.eth.defaultAccount).call({ from: web3.eth.defaultAccount });
    return {
        token_liquidity: liquidity_tokens,
        eth_liquidity: liquidity_eth,
        token_eth_rate: liquidity_tokens / liquidity_eth,
        eth_token_rate: liquidity_eth / liquidity_tokens,
        total_supply: total_supply,
        current_balance: current_balance
    };
}

// This is a log function, provided if you want to display things to the page instead of the
// JavaScript console. It may be useful for debugging but usage is not required.
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
    $("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
}

// mint token
async function mint(amount) {
    try {
        await token_contract.methods._mint(amount).send({ from: web3.eth.defaultAccount, gas: 999999 });
    }
    catch (err) {
        console.log("Error calling mint: " + err);
    }
}

// ============================================================
//                    FUNCTIONS TO IMPLEMENT
// ============================================================

// Note: maxSlippagePct will be passed in as an int out of 100. 
// Be sure to divide by 100 for your calculations.

/*** ADD LIQUIDITY ***/
async function addLiquidity(amountEth, maxSlippagePct) {
    /** TODO: ADD YOUR CODE HERE **/
    // Convert amount from ETH to Wei
    const amountWei = web3.utils.toWei(amountEth.toString(), 'ether');

    // Calculate the maximum slippage amount
    // const maxSlippage = amountWei * (maxSlippagePct / 100);

    // Call the addLiquidity function from the smart contract
    try {
        await exchange_contract.methods.addLiquidity().send({
            from: web3.eth.defaultAccount,
            value: amountWei, // Send ETH along with the transaction
            gas: 999999
        });
    } catch (error) {
        console.error("Error adding liquidity: ", error);
    }
}

/*** REMOVE LIQUIDITY ***/
async function removeLiquidity(amountEth, maxSlippagePct) {
    /** TODO: ADD YOUR CODE HERE **/
    // Convert amount from ETH to Wei, as Ethereum transactions are done in Wei
    const amountWei = web3.utils.toWei(amountEth.toString(), 'ether');

    // Calculate the maximum slippage amount in Wei
    // const maxSlippage = amountWei * (maxSlippagePct / 100);

    // Call the removeLiquidity function from the smart contract
    try {
        const transaction = await exchange_contract.methods.removeLiquidity(amountWei).send({
            from: web3.eth.defaultAccount,
            gas: 999999 // You might want to adjust the gas limit based on your contract's requirements
        });

        // Additional code can go here to handle the response, like updating the UI
    } catch (error) {
        console.error("Error removing liquidity: ", error);
        // Handle the error appropriately in your UI
    }
}

async function removeAllLiquidity(maxSlippagePct) {
    /** TODO: ADD YOUR CODE HERE **/
    try {
        const transaction = await exchange_contract.methods.removeAllLiquidity().send({
            from: web3.eth.defaultAccount,
            gas: 999999 // Adjust gas limit based on contract requirements
        });

        // Additional code can go here to handle the response, such as updating the UI
    } catch (error) {
        console.error("Error removing all liquidity: ", error);
        // Handle the error appropriately in your UI
    }
}

/*** SWAP ***/
async function swapTokensForETH(amountToken, maxSlippagePct) {
    /** TODO: ADD YOUR CODE HERE **/
    // Convert token amount to Wei (if your token also uses 18 decimal places)
    const amountTokenWei = web3.utils.toWei(amountToken.toString(), 'ether');

    // Calculate the minimum amount of ETH you are willing to receive after slippage
    // const ethAmountAfterSlippage = await exchange_contract.methods.getEthAmountForTokenSwap(amountTokenWei).call();
    // const minEthAmount = ethAmountAfterSlippage * (1 - maxSlippagePct / 100);

    // Approve the exchange to spend tokens
    await token_contract.methods.approve(exchange_address, amountTokenWei).send({
        from: web3.eth.defaultAccount,
        gas: 999999 // Adjust gas limit as needed
    });

    // Call the swapTokensForETH function from the smart contract
    try {
        await exchange_contract.methods.swapTokensForETH(amountTokenWei).send({
            from: web3.eth.defaultAccount,
            gas: 999999 // Again, adjust the gas limit as needed
        });
        // You can add code here to handle a successful transaction
    } catch (error) {
        console.error("Error swapping tokens for ETH: ", error);
        // Handle the error appropriately in your UI
    }
}

async function swapETHForTokens(amountETH, maxSlippagePct) {
    /** TODO: ADD YOUR CODE HERE **/
    // Convert the amount from ETH to Wei
    const amountWei = web3.utils.toWei(amountETH.toString(), 'ether');

    // Calculate the expected token amount for the given ETH
    // const expectedTokenAmount = await exchange_contract.methods.getTokenAmountForEthSwap(amountWei).call();

    // Apply the maximum slippage to calculate the minimum acceptable token amount
    // const minTokenAmount = expectedTokenAmount * (1 - maxSlippagePct / 100);

    // Call the swapETHForTokens function from the smart contract
    try {
        await exchange_contract.methods.swapETHForTokens().send({
            from: web3.eth.defaultAccount,
            value: amountWei, // Amount of ETH to swap
            gas: 999999 // Adjust the gas limit as needed
        });
        // Code to handle successful transaction can go here
    } catch (error) {
        console.error("Error swapping ETH for tokens: ", error);
        // Handle the error appropriately in your UI
    }
}

// function handle create pool
async function createPool(amountETH, amountTokens) {
    try {
        await exchange_contract.methods.createPool(amountTokens).send({
            from: web3.eth.defaultAccount,
            value: web3.utils.toWei(amountETH.toString(), 'ether'),
            gas: 999999
        });
    } catch (error) {
        console.error("Error create pool: ", error);
        // Handle the error appropriately in your UI
    }
}

// function handle allow exchange transfer token
async function approveExchange(amountTokens) {
    try {
        await token_contract.methods.approve(exchange_address, amountTokens).send({
            from: web3.eth.defaultAccount,
            gas: 999999
        });
    } catch (error) {
        console.error("Error approve exchange: ", error);
        // Handle the error appropriately in your UI
    }
}

// =============================================================================
//                           	UI (DO NOT MOFIDY)
// =============================================================================


// This sets the default account on load and displays the total owed to that
// account.
web3.eth.getAccounts().then((response) => {
    web3.eth.defaultAccount = response[0];
    // Initialize the exchange
    init().then(() => {
        // fill in UI with current exchange rate:
        getPoolState().then((poolState) => {
            $("#eth-token-rate-display").html("1 ETH = " + poolState['token_eth_rate'] + " " + token_symbol);
            $("#token-eth-rate-display").html("1 " + token_symbol + " = " + poolState['eth_token_rate'] + " ETH");
            $("#current-token-supply").html("Total Supply HUST Token: " + poolState['total_supply'] + " " + token_symbol);
            $("#current-token-balance").html("Your HUST Token Balance: " + poolState['current_balance'] + " " + token_symbol);
            $("#token-reserves").html(poolState['token_liquidity'] + " " + token_symbol);
            $("#eth-reserves").html(poolState['eth_liquidity'] + " ETH");
        });
    });
});

// Allows switching between accounts in 'My Account'
web3.eth.getAccounts().then((response) => {
    var opts = response.map(function (a) {
        return '<option value="' +
            a.toLowerCase() + '">' + a.toLowerCase() + '</option>'
    });
    $(".account").html(opts);
});

// This runs the 'swapETHForTokens' function when you click the button
$("#swap-eth").click(function () {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    swapETHForTokens($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'swapTokensForETH' function when you click the button
$("#swap-token").click(function () {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    swapTokensForETH($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'addLiquidity' function when you click the button
$("#add-liquidity").click(function () {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    addLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'removeLiquidity' function when you click the button
$("#remove-liquidity").click(function () {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    removeLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'removeAllLiquidity' function when you click the button
$("#remove-all-liquidity").click(function () {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    removeAllLiquidity($("#max-slippage-liquid").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This run the 'mint' function when you click the button
$("#mint-token").click(function () {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    mint($("#total-mint").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

$("#create-pool").click(function () {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    createPool($("#total-eth").val(), $("#total-token").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

$("#allow-transfer-token").click(function () {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    approveExchange($("#allow-transfer").val()).then((response) => {
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// Fills in relevant parts of UI with your token and exchange name info:
$("#swap-eth").html("Swap ETH for " + token_symbol);

$("#swap-token").html("Swap " + token_symbol + " for ETH");

$("#title").html(exchange_name);
