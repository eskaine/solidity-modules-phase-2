import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import treeFile from '../../tree.json';

function getMerkleProof(bitmapIndex) {
    // get hardcoded values
    const {value} = treeFile.values[bitmapIndex];
    const [address, index] = value;
    let proof = [];

    const tree = StandardMerkleTree.load(treeFile);
    const leaf = tree.leafHash([address, index]);

    // get proof
    for (const [i, v] of tree.entries()) {
        if (v[0] === address && i == bitmapIndex) {
            proof = tree.getProof(i);
            break;
        }
    }

    return { proof, leaf, index };
}

export {getMerkleProof}