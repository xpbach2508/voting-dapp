pragma solidity > 0.8.9;

contract VotingToken {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) allowance;
    mapping (address => uint256) public depositOf;

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply){
        name = _name;
        symbol = _symbol;
        balanceOf[msg.sender] = _initialSupply;
    }
    function deposit() payable public {
        depositOf[msg.sender] = msg.value;
    }
}