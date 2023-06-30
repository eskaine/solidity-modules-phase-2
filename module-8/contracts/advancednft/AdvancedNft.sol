// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./AdvancedNftState.sol";

contract AdvancedNft is ERC721("AdvancedNft", "AN"), AdvancedNftState, Pausable, ReentrancyGuard {
    struct MintDetails {
        address owner;
        bytes32 idHash;
        uint256 blockNum;
    }

    using BitMaps for BitMaps.BitMap;
    uint256 public constant MAX_SUPPLY = 999;
    bytes32 private _root;
    // 1st method of tracking
    // mapping(address => bool) private addressMinted;
    // 2nd method of tracking, cost effective method
    BitMaps.BitMap private _addressMintedBitmap;

    // Mapping from token ID hash to token details
    mapping(bytes32 => MintDetails) private _committedMints;
    mapping(address => uint256) funds;

    event CommitMint(address indexed from, address indexed to, bytes32 indexed tokenIdHash);
    event MultiTransfer(address indexed from, address indexed to, uint256[] indexed tokenIds);
    event Mint(address indexed to, uint256 indexed tokenId);
    event BuyToken(address indexed from, address indexed to, uint256 indexed tokenId);
    event WithdrawFunds(address indexed to, uint256 indexed tokenId);

    constructor(bytes32 root) {
        _root = root;
    }

    // transfer multicall to single receiver
    function multiTransfer(address to, uint256[] calldata tokenIds) external atStage(Stages.Withdrawal) {
        require(to != address(0), "Invalid address!");

        for(uint256 i; i < tokenIds.length; i++) {
            uint256 id = tokenIds[i];
            approve(to, id);
            transferFrom(msg.sender, to, id);
        }

        emit MultiTransfer(msg.sender, to, tokenIds);
    }

    function reveal(uint256 tokenId) external atStage(Stages.Withdrawal) {
        bytes32 tokenIdHash = keccak256(abi.encodePacked(msg.sender, tokenId));
        MintDetails memory details = _committedMints[tokenIdHash];

        require(tokenIdHash == details.idHash, "Invalid hash!");
        // 10 blocks in the future
        require(block.number > details.blockNum, "Token ID can only be reveal in the future!");

        _mint(msg.sender, tokenId);

        emit Mint(msg.sender, tokenId);
    }

    function buyToken(uint256 tokenId) public payable nonReentrant atStage(Stages.Withdrawal) {
        address tokenOwner = ownerOf(tokenId);
        funds[tokenOwner] += msg.value;

        approve(msg.sender, tokenId);
        transferFrom(tokenOwner, msg.sender, tokenId);

        emit BuyToken(tokenOwner, msg.sender, tokenId);
    }

    function withdrawFunds() public whenNotPaused nonReentrant {
        uint amount = funds[msg.sender];

        require(amount > 0);
        require(address(this).balance >= amount);

        funds[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit WithdrawFunds(msg.sender, amount);
    }

    function commitMint(bytes32[] memory proof, bytes32 leaf, uint256 index, bytes32 tokenIdHash) external atStage(Stages.Withdrawal) {
        // check the intended nft is not already minted 
        require(!_addressMintedBitmap.get(index), "Already minted!");
        // check the caller is the owner of a specific nft before allowing to mint
        require(MerkleProof.verify(proof, _root, leaf), "Invalid proof or leaf!");

        _addressMintedBitmap.setTo(index,true);
        _commitMint(msg.sender, tokenIdHash);
    }

    // commit hash of token id
    function _commitMint(address to, bytes32 tokenIdHash) private {
        require(to != address(0), "ERC721: mint to the zero address");

        _committedMints[tokenIdHash] = MintDetails(to, tokenIdHash, block.number);

        emit CommitMint(address(0), to, tokenIdHash);
    }
}

