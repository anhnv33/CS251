// =================== CS251 DEX Project =================== //
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../interfaces/IERC20.sol";
import "./token.sol";
import "../libraries/ownable.sol";
// import "@openzeppelin/contracts/math/SafeMath.sol";



/* This exchange is based off of Uniswap V1. The original whitepaper for the constant product rule
 * can be found here:
 * https://github.com/runtimeverification/verified-smart-contracts/blob/uniswap/uniswap/x-y-k.pdf
 */

contract TokenExchange is Ownable {
    // using SafeMath for uint256;
    address public admin;

    address tokenAddr = 0xAaC5Ad4c14570771144ee36CF6587BE499eAE60D; // TODO: Paste token contract address here.
    HUSTToken private token = HUSTToken(tokenAddr); // TODO: Replace "Token" with your token class.

    // Liquidity pool for the exchange
    uint public token_reserves = 0;
    uint public eth_reserves = 0;

    // Constant: x * y = k
    uint public k;

    // liquidity rewards
    uint private swap_fee_numerator = 0; // TODO Part 5: Set liquidity providers' returns.
    uint private swap_fee_denominator = 100;

    event AddLiquidity(address from, uint amount);
    event RemoveLiquidity(address to, uint amount);

    mapping(address => uint256) public userLiquidity;

    constructor() {
        admin = msg.sender;
    }

    /**
     * Initializes a liquidity pool between your token and ETH.
     *
     * This is a payable function which means you can send in ETH as a quasi-parameter. In this
     * case, the amount of eth sent to the pool will be in msg.value and the number of tokens will
     * be amountTokens.
     *
     * Requirements:
     *  - the liquidity pool should be empty to start
     *  - the sender should send positive values for each
     */
    function createPool(uint amountTokens) external payable onlyOwner {
        // This function is already implemented for you; no changes needed

        // require pool does not yet exist
        require(token_reserves == 0, "Token reserves was not 0");
        require(eth_reserves == 0, "ETH reserves was not 0.");

        // require nonzero values were sent
        require(msg.value > 0, "Need ETH to create pool.");
        require(amountTokens > 0, "Need tokens to create pool.");

        token.transferFrom(msg.sender, address(this), amountTokens);
        eth_reserves = msg.value;
        token_reserves = amountTokens;
        k = eth_reserves * token_reserves;

        // Update the user's liquidity contribution
        userLiquidity[msg.sender] = msg.value;
    }

    // ============================================================
    //                    FUNCTIONS TO IMPLEMENT
    // ============================================================

    // Given an amount of tokens, calculates the corresponding amount of ETH
    // based on the current exchange rate of the pool.
    //
    // NOTE: You can change the inputs, or the scope of your function, as needed.
    function amountTokenGivenETH(uint amountToken) public view returns (uint) {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate how much ETH is of equivalent worth based on the current exchange rate.
        */
    }

    // Given an amount of ETH, calculates the corresponding amount of tokens
    // based on the current exchange rate of the pool.
    //
    // NOTE: You can change the inputs, or the scope of your function, as needed.
    function amountETHGivenToken(uint amountETH) public view returns (uint) {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate how much of your token is of equivalent worth based on the current exchange rate.
        */
    }

    /* ========================= Liquidity Provider Functions =========================  */

    /**
     * Adds liquidity given a supply of ETH (sent to the contract as msg.value).
     *
     * Calculates the liquidity to be added based on what was sent in and the prices. If the
     * caller possesses insufficient tokens to equal the ETH sent, then the transaction must
     * fail. A successful transaction should update the state of the contract, including the
     * new constant product k, and then Emit an AddLiquidity event.
     *
     * NOTE: You can change the inputs, or the scope of your function, as needed.
     */
    function addLiquidity() external payable {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate the liquidity to be added based on what was sent in and the prices.
            If the caller possesses insufficient tokens to equal the ETH sent, then transaction must fail.
            Update token_reserves, eth_reserves, and k.
            Emit AddLiquidity event.
        */
        // Ensure that both ETH and tokens are being added
        require(msg.value > 0, "Must provide ETH for liquidity");
        // require(token_amount > 0, "Must provide tokens for liquidity");

        // If it's not the first time liquidity is being added,
        // ensure the ratio of ETH to tokens is maintained.
        // if (token_reserves > 0 && eth_reserves > 0) {
        //     require(token_reserves * msg.value == eth_reserves * token_amount, "Incorrect ETH to Token ratio");
        // }
        uint256 token_amount = token_reserves * msg.value / eth_reserves;

        // Transfer the tokens from the sender to the contract
        require(token.transferFrom(msg.sender, address(this), token_amount),
                "Token transfer failed");

        // Update the reserves
        token_reserves += token_amount;
        eth_reserves += msg.value;
        k = token_reserves * eth_reserves;

        // Update the constant product
        k = token_reserves * eth_reserves;

        // Update the user's liquidity contribution
        userLiquidity[msg.sender] += msg.value;

        // Emit the liquidity event
        emit AddLiquidity(msg.sender, token_amount);
    }

    /**
     * Removes liquidity given the desired amount of ETH to remove.
     *
     * Calculates the amount of your tokens that should be also removed. If the caller is not
     * entitled to remove the desired amount of liquidity, the transaction should fail. A
     * successful transaction should update the state of the contract, including the new constant
     * product k, transfer the ETH and Token to the sender and then Emit an RemoveLiquidity event.
     *
     * NOTE: You can change the inputs, or the scope of your function, as needed.
     */
    function removeLiquidity(uint256 eth_amount) public payable {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate the amount of your tokens that should be also removed.
            Transfer the ETH and Token to the provider.
            Update token_reserves, eth_reserves, and k.
            Emit RemoveLiquidity event.
        */
        // Check if the caller has enough liquidity to remove
        // This requires tracking each user's liquidity contribution (not shown in your initial contract)
        require(userLiquidity[msg.sender] >= eth_amount, "Not enough liquidity to remove");

        // Calculate the amount of tokens to be removed based on the ETH amount
        // This is derived from the constant product formula
        uint256 token_amount = (eth_amount * token_reserves) / eth_reserves;

        // Check if the pool has enough liquidity to honor the removal
        require(eth_reserves >= eth_amount, "Insufficient ETH in reserves");
        require(token_reserves >= token_amount, "Insufficient tokens in reserves");

        // Update the reserves
        eth_reserves -= eth_amount;
        token_reserves -= token_amount;

        // Update the constant product
        k = token_reserves * eth_reserves;

        // Transfer ETH and tokens back to the liquidity provider
        payable(msg.sender).transfer(eth_amount);
        require(token.transfer(msg.sender, token_amount), "Token transfer failed");

        // Update the user's liquidity contribution
        userLiquidity[msg.sender] -= eth_amount;

        // Emit the liquidity removal event
        emit RemoveLiquidity(msg.sender, eth_amount);
    }

    /**
     * Removes all liquidity that the sender is entitled to withdraw.
     *
     * Calculate the maximum amount of liquidity that the sender is entitled to withdraw and then
     * calls removeLiquidity() to remove that amount of liquidity from the pool.
     *
     * NOTE: You can change the inputs, or the scope of your function, as needed.
     */
    function removeAllLiquidity() external payable {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Decide on the maximum allowable ETH that msg.sender can remove.
            Call removeLiquidity().
        */
        // Retrieve the user's total liquidity contribution in ETH
        uint256 userEthContribution = userLiquidity[msg.sender];

        // Ensure the user has liquidity to remove
        require(userEthContribution > 0, "No liquidity to remove");

        // Calculate the user's share of the total liquidity pool
        // This is the ratio of the user's ETH contribution to the total ETH reserves
        uint256 userShare = userEthContribution * 1e18 / eth_reserves; // 1e18 for precision

        // Calculate the amount of tokens corresponding to the user's share
        uint256 tokenAmount = token_reserves * userShare / 1e18;  // Adjust back after multiplying for precision

        // Check if the pool has enough liquidity to honor the withdrawal
        require(eth_reserves >= userEthContribution, "Insufficient ETH in reserves");
        require(token_reserves >= tokenAmount, "Insufficient tokens in reserves");

        // Update the reserves and constant product k
        eth_reserves -= userEthContribution;
        token_reserves -= tokenAmount;
        k = token_reserves * eth_reserves;

        // Update the user's liquidity contribution to zero
        userLiquidity[msg.sender] = 0;

        // Transfer ETH and tokens back to the user
        payable(msg.sender).transfer(userEthContribution);
        require(token.transfer(msg.sender, tokenAmount), "Token transfer failed");

        // Emit the liquidity removal event
        emit RemoveLiquidity(msg.sender, userEthContribution);
    }

    /***  Define helper functions for liquidity management here as needed: ***/

    /* ========================= Swap Functions =========================  */

    /**
     * Swaps amountTokens of Token in exchange for ETH.
     *
     * Calculates the amount of ETH that should be swapped in order to keep the constant
     * product property, and transfers that amount of ETH to the provider. If the caller
     * has insufficient tokens, the transaction should fail. If performing the swap would
     * exhaust the total supply of ETH inside the exchange, the transaction must fail.
     *
     * Part 4 – Expand the function to take in additional parameters as needed. If the
     *          exchange rate is greater than the slippage limit, the swap should fail.
     *
     * Part 5 – Only exchange amountTokens minus the fee taken out for liquidity providers
     *          and keep track of the liquidity fees to be added back into the pool.
     *
     * NOTE: You can change the inputs, or the scope of your function, as needed.
     */
    function swapTokensForETH(uint amountTokens) external payable {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate amount of ETH should be swapped based on exchange rate.
            Transfer the ETH to the provider.
            If the caller possesses insufficient tokens, transaction must fail.
            If performing the swap would exhaus total ETH supply, transaction must fail.
            Update token_reserves and eth_reserves.

            Part 4: 
                Expand the function to take in addition parameters as needed.
                If current exchange_rate > slippage limit, abort the swap.
            
            Part 5:
                Only exchange amountTokens * (1 - liquidity_percent), 
                    where % is sent to liquidity providers.
                Keep track of the liquidity fees to be added.
        */

        // Check if the user has enough tokens
        require(token.balanceOf(msg.sender) >= amountTokens, "Insufficient tokens");

        // Calculate the amount of ETH to be swapped
        uint256 ethAmount = getEthAmountForTokenSwap(amountTokens);

        // Check if the pool has enough ETH to perform the swap
        require(ethAmount <= eth_reserves, "Insufficient ETH in reserves");

        // Transfer tokens from the user to the contract
        require(token.transferFrom(msg.sender, address(this), amountTokens), "Token transfer failed");

        // Update the reserves
        token_reserves += amountTokens;
        eth_reserves -= ethAmount;

        // Send ETH to the user
        payable(msg.sender).transfer(ethAmount);

        /***************************/
        // DO NOT CHANGE BELOW THIS LINE
        _checkRounding();
    }

    /**
     * Swaps msg.value ETH in exchange for your tokens.
     *
     * Calculates the amount of tokens that should be swapped in order to keep the constant
     * product property, and transfers that number of tokens to the sender. If performing
     * the swap would exhaust the total supply of tokens inside the exchange, the transaction
     * must fail.
     *
     * Part 4 – Expand the function to take in additional parameters as needed. If the
     *          exchange rate is greater than the slippage limit, the swap should fail.
     *
     * Part 5 – Only exchange amountTokens minus the fee taken out for liquidity providers
     *          and keep track of the liquidity fees to be added back into the pool.
     *
     * NOTE: You can change the inputs, or the scope of your function, as needed.
     */
    function swapETHForTokens() external payable {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate amount of your tokens should be swapped based on exchange rate.
            Transfer the amount of your tokens to the provider.
            If performing the swap would exhaus total token supply, transaction must fail.
            Update token_reserves and eth_reserves.

            Part 4: 
                Expand the function to take in addition parameters as needed.
                If current exchange_rate > slippage limit, abort the swap. 
            
            Part 5: 
                Only exchange amountTokens * (1 - %liquidity), 
                    where % is sent to liquidity providers.
                Keep track of the liquidity fees to be added.
        */

        // Check if the contract received ETH
        uint256 ethAmount = msg.value;
        require(ethAmount > 0, "No ETH sent");

        // Calculate the amount of tokens to be swapped
        uint256 tokenAmount = getTokenAmountForEthSwap(ethAmount);

        // Check if the pool has enough tokens to perform the swap
        require(tokenAmount <= token_reserves, "Insufficient tokens in reserves");

        // Update the reserves
        eth_reserves += ethAmount;
        token_reserves -= tokenAmount;

        // Transfer tokens to the user
        require(token.transfer(msg.sender, tokenAmount), "Token transfer failed");

        /**************************/
        // DO NOT CHANGE BELOW THIS LINE
        _checkRounding();
    }

    function getTokenAmountForEthSwap(uint256 ethAmount) public view returns (uint256) {
        // Ensure there's enough in the reserves
        require(token_reserves > 0 && eth_reserves > 0, "Reserves are empty");

        // Calculate the new ETH reserves after the swap
        uint256 newEthReserves = eth_reserves + ethAmount;

        // Use the constant product formula to find the new token reserves
        // newTokenReserves * newEthReserves = k
        uint256 newTokenReserves = k / newEthReserves;

        // Ensure the new reserves are less than the current (indicating a valid swap)
        require(newTokenReserves < token_reserves, "Invalid swap");

        // The tokens to be received is the difference between the current and new token reserves
        uint256 tokensReceived = token_reserves - newTokenReserves;

        return tokensReceived;
    }

    function getEthAmountForTokenSwap(uint amountTokens) public view returns (uint256) {
        // Ensure there's enough in the reserves
        require(token_reserves > 0 && eth_reserves > 0, "Reserves are empty");

        // Calculate the new token reserves after the swap
        uint256 newTokenReserves = token_reserves + amountTokens;

        // Use the constant product formula to find the new ETH reserves
        // newTokenReserves * newEthReserves = k
        uint256 newEthReserves = k / newTokenReserves;

        // Ensure the new reserves are less than the current (indicating a valid swap)
        require(newEthReserves < eth_reserves, "Invalid swap");

        // The ETH to be received is the difference between the current and new ETH reserves
        uint256 ethReceived = eth_reserves - newEthReserves;

        return ethReceived;
    }

    /**
     * Checks that users are not able to get "free money" due to rounding errors.
     *
     * A liquidity provider should be able to input more (up to 1) tokens than they are theoretically
     * entitled to, and should be able to withdraw less (up to -1) tokens then they are entitled to.
     *
     * Checks for Math.abs(token_reserves * eth_reserves - k) < (token_reserves + eth_reserves + 1));
     * to account for the small decimal errors during uint division rounding.
     */
    function _checkRounding() private {
        uint check = token_reserves * eth_reserves;
        if (check >= k) {
            check = check - k;
        } else {
            check = k - check;
        }
        assert(check < (token_reserves + eth_reserves + 1));
        k = token_reserves * eth_reserves; // reset k due to small rounding errors
    }

    /***  Define helper functions for swaps here as needed ***/
    // TODO Part 4: Implement this function

    function priceToken() public view returns (uint) {
        require(token_reserves > 0, "No tokens in reserves");
        return token_reserves / eth_reserves;
    }

    function priceETH() public view returns (uint) {
        require(eth_reserves > 0, "No ETH in reserves");
        return eth_reserves / token_reserves;
    }

}
