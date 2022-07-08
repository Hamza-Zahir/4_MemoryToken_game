// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyCollectible is ERC721 {
    constructor() ERC721("MyCollectible", "MCO") {
    }

    function mint(address _to, string memory _tokenURI) public returns(bool) {
       uint _tokenId = totalSupply().add(1);
       _mint(_to, _tokenId);
       _setTokenURI(_tokenId, _tokenURI);
       return true;
    }
}




// pragma solidity >=0.4.22 <0.9.0;
// // pragma solidity ^0.5.0;

// import "./ERC721Full.sol";

// contract MemoryToken is ERC721Full {

//     constructor() ERC721Full("Memory Token", "MEMORY") public {
//     }

//     function mint(address _to, string memory _tokenURI) public returns(bool) {
//        uint _tokenId = totalSupply().add(1);
//        _mint(_to, _tokenId);
//        _setTokenURI(_tokenId, _tokenURI);
//        return true;
//     }
// }
