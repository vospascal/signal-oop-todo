// @ts-nocheck
// 🔥 Updated `@SynapseNode` Decorator with Scheduled Updates
export function SynapseNode(target) {
    return class extends target {
        constructor(...args) {
            super(...args);
            this.parent = null;
            this.child = null;
            this.sibling = null;
            this.alternate = null; // Previous state reference for diffing

            this._baseline = this.takeSnapshot();
            this.changeSignal = new Signal();

            // 🌲 Register this node in the debugging system
            SynapseTreeInspector.registerNode(this);
        }

        takeSnapshot() {
            const snapshot = {};
            for (const key of Object.keys(this)) {
                if (key.startsWith("_")) continue;
                const value = this[key];
                if (Array.isArray(value)) {
                    snapshot[key] = value.map(item => (item instanceof SynapseNode ? item.takeSnapshot() : item));
                } else if (value instanceof SynapseNode) {
                    snapshot[key] = value.takeSnapshot();
                } else {
                    snapshot[key] = value;
                }
            }
            return snapshot;
        }

        diff() {
            return SynapseNode.diffObjects(this._baseline, this);
        }

        static diffObjects(oldObj, currentObj) {
            const patch = {};
            for (const key in currentObj) {
                if (key.startsWith("_")) continue;
                const newVal = currentObj[key];
                const oldVal = oldObj[key];

                if (Array.isArray(newVal)) {
                    if (!oldVal || oldVal.length !== newVal.length) {
                        patch[key] = newVal;
                    } else {
                        const arrPatch = [];
                        for (let i = 0; i < newVal.length; i++) {
                            if (newVal[i] instanceof SynapseNode) {
                                const childDiff = newVal[i].diff();
                                if (Object.keys(childDiff).length > 0) {
                                    arrPatch[i] = childDiff;
                                }
                            } else if (newVal[i] !== oldVal[i]) {
                                arrPatch[i] = newVal[i];
                            }
                        }
                        if (Object.keys(arrPatch).length > 0) {
                            patch[key] = arrPatch;
                        }
                    }
                } else if (newVal instanceof SynapseNode) {
                    const childDiff = newVal.diff();
                    if (Object.keys(childDiff).length > 0) {
                        patch[key] = childDiff;
                    }
                } else {
                    if (newVal !== oldVal) {
                        patch[key] = newVal;
                    }
                }
            }
            return patch;
        }

        applyPatch(patch) {
            for (const key in patch) {
                const value = patch[key];
                if (Array.isArray(value)) {
                    this[key] = value;
                } else if (typeof value === "object" && value !== null && this[key] instanceof SynapseNode) {
                    this[key].applyPatch(value);
                } else {
                    this[key] = value;
                }
            }
            this.changeSignal.emit({ type: "update", patch, node: this });
            this._baseline = this.takeSnapshot();
        }

        reconcile(externalNode) {
            const patch = this.diff();
            if (Object.keys(patch).length > 0) {
                externalNode.applyPatch(patch);
            }
            this._baseline = this.takeSnapshot();
        }

        // 🏆 New: Schedule Updates
        scheduleUpdate(priority = "normal") {
            SynapseScheduler.scheduleUpdate(this, priority);
        }
    };
}


