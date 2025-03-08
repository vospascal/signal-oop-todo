// @ts-nocheck
// 🌲 Synapse Tree Inspector: Debugging Tool
export class SynapseTreeInspector {
    static nodes = [];

    static registerNode(node) {
        SynapseTreeInspector.nodes.push(node);
    }

    static inspectTree() {
        console.log("🔍 Synapse Node Tree:", SynapseTreeInspector.nodes);
    }
}