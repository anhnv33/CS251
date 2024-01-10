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
    string private constant symbol = 'HUST';                 // TODO: Give your token a symbol
    string private constant name = 'HUSTToken';                   // TODO: Give your token a name

    uint256 private _totalSupply = 0;

    mapping(address => uint256) private _balances;   

    mapping (address => mapping (address => uint256)) private _allowances;

    bool private minting_disabled = false;

    // constructor(string memory name_, string memory symbol_) {
    //     name = name_;
    //     symbol = symbol_;
    // }

    // ============================================================
    //                    FUNCTIONS TO IMPLEMENT
    // ============================================================


    function decimals() public view virtual returns (uint8) {
        return 18;
    }

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

        // _totalSupply += amount / 10 ** decimals();
        // _balances[msg.sender] += amount / 10 ** decimals();
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

    /**
     * Returns the total supply of the token.
     * 
     * NOTE: This is a required override by OpenZeppelin's ERC20 contract.
     * 
     * Requirements:
     *  - there are no requirements for this function
     *  - you can change the inputs or the scope of your function, as needed
     */
    function totalSupply() 
        external 
        view 
        override 
        returns (uint256)
    {
        return _totalSupply;
    }

    /**
     * Returns the account balance of another account with address `owner`.
     * 
     * NOTE: This is a required override by OpenZeppelin's ERC20 contract.
     * 
     * Requirements:
     *  - there are no requirements for this function
     *  - you can change the inputs or the scope of your function, as needed
     */
    function balanceOf(address owner) 
        external 
        view 
        override 
        returns (uint256)
    {
        return _balances[owner];
    }

    function uintToString(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        return string(bstr);
    }

    /**
     * Transfers `amount` tokens from the caller's account to `recipient`.
     * 
     * NOTE: This is a required override by OpenZeppelin's ERC20 contract.
     * 
     * Emits a {Transfer} event.
     * 
     * Requirements:
     *  - `recipient` cannot be the zero address
     *  - the caller must have a balance of at least `amount`
     *  - you can change the inputs or the scope of your function, as needed
     */
    function transfer(address recipient, uint256 amount) 
        external 
        override 
        returns (bool)
    {
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(_balances[msg.sender] >= amount, uintToString(amount)); //"ERC20: transfer amount exceeds balance"

        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);

        return true;
    }

    /**
     * Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. 
     * This is zero by default.
     * 
     * This value changes when {approve} or {transferFrom} are called.
     * 
     * NOTE: This is a required override by OpenZeppelin's ERC20 contract.
     * 
     * Requirements:
     *  - there are no requirements for this function
     *  - you can change the inputs or the scope of your function, as needed
     */
    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }  

    /**
     * Sets `amount` as the allowance of `spender` over the caller's tokens.
     * 
     * Emits an {Approval} event.
     * 
     * NOTE: This is a required override by OpenZeppelin's ERC20 contract.
     * 
     * Requirements:
     *  - `spender` cannot be the zero address
     *  - the caller must have a balance of at least `amount`
     *  - you can change the inputs or the scope of your function, as needed
     */
    function approve(address spender, uint256 amount) 
        external 
        override 
        returns (bool)
    {
        require(spender != address(0), "ERC20: approve to the zero address");
        require(_balances[msg.sender] >= amount, "ERC20: approve amount exceeds balance");

        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);

        return true;
    }

    /**
     * Moves `amount` tokens from `sender` to `recipient` using the allowance mechanism. 
     * `amount` is then deducted from the caller's allowance.
     * 
     * Emits a {Transfer} event.
     * 
     * Requirements:
     *  - `sender` and `recipient` cannot be the zero address
     *  - `sender` must have a balance of at least `amount`
     *  - the caller must have allowance for `sender`'s tokens of at least `amount`
     *  - you can change the inputs or the scope of your function, as needed
     */
    function transferFrom(address sender, address recipient, uint256 amount) 
        external 
        override 
        returns (bool)
    {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(_balances[sender] >= amount, "ERC20: transfer amount exceeds balance");
        require(_allowances[sender][msg.sender] >= amount, "ERC20: transfer amount exceeds allowance");

        _balances[sender] -= amount;
        _balances[recipient] += amount;
        _allowances[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);

        return true;
    }
}