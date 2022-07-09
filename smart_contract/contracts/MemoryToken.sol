// pragma solidity ^0.5.0;
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";

contract MemoryToken is ERC721Full  {

    constructor() ERC721Full("Memory Token", "MEMORY") public {
    }

    function mint(address _to, string memory _tokenURI) public returns(bool) {
       uint _tokenId = totalSupply().add(1);
       _mint(_to, _tokenId);
       _setTokenURI(_tokenId, _tokenURI);
       return true;
    }
}
