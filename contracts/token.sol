// =================== CS251 DEX Project =================== // 
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //    
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Please check out the OpenZeppelin contracts for ERC20 tokens!
// Links can be found in the the respective solidity files
import "../interfaces/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '../libraries/erc20.sol';
import '../libraries/ownable.sol';


// Your token contract
// TODO: Replace "Token" with your token name!
contract HUSTToken is Ownable, IERC20 {
    string public constant symbol = 'HUST';                 // TODO: Give your token a symbol
    string public constant name = 'HUSTToken';                   // TODO: Give your token a name

    uint private _totalSupply = 0;

    mapping(address => uint) private _balances;     

    bool public minting_disabled = false;

    constructor() ERC20(name, symbol) {}

    // ============================================================
    //                    FUNCTIONS TO IMPLEMENT
    // ============================================================

    /**
     * Creates `amount` tokens, increasing the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address (the "Black Hole").
     *
     * Requirements:
     *  - only the owner of this contract can mint new tokens
     *  - the account who recieves the minted tokens cannot be the zero address
     *  - you can change the inputs or the scope of your function, as needed
     */
    function _mint(uint amount) 
        public 
        onlyOwner
    {
        /******* TODO: Implement this function *******/
        require(msg.sender != address(0), "ERC20: mint to the zero address");
        require(minting_disabled == false, "Minting is disabled");

        _totalSupply += amount;
        _balances[msg.sender] += amount;
        emit Transfer(address(0), msg.sender, amount);
        
    }

    /**
     * Disables the ability to mint tokens in the future.
     *
     * Requirements:
     *  - only the owner of this contract can disable minting
     *  - once you disable minting, you should never be able to mint ever again. never.
     *  - you can change the inputs or the scope of your function, as needed
     */
    function _disable_mint()
        public
        onlyOwner
    {
        /******* TODO: Implement this function *******/
        minting_disabled = true;
    }
}