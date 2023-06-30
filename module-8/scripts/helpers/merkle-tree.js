const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");

function createTree(treeValues) {
  const tree = StandardMerkleTree.of(treeValues, ["address", "uint256"]);
  fs.writeFileSync("client/src/tree.json", JSON.stringify(tree.dump()));
  return tree;
}

module.exports = {
    createTree,
};
