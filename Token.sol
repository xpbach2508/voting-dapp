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
        totalSupply += _initialSupply;
    }
    function deposit() payable public {
        depositOf[msg.sender] = msg.value;
        // 0.1 eth 1000token
        uint256 totalTokenReceive = msg.value * 1000 / (0.1 * 10**18);
        balanceOf[msg.sender] = totalTokenReceive;
        totalSupply += totalTokenReceive;
    }

    function transfer(address _to, uint256 _value) public returns(bool success) {
        _transfer(msg.sender, _to, _value);
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        require(balanceOf[_from] > _value, "Insufficient balance");
        require(_to != address(0), "Address 0 repipient");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
    }
}