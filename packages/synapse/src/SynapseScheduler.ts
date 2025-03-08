// @ts-nocheck
// 🌟 Task Scheduler for Fiber-like Incremental Updates
export class SynapseScheduler {
    static taskQueue = [];
    static isProcessing = false;

    static scheduleUpdate(node, priority = "normal") {
        SynapseScheduler.taskQueue.push({ node, priority });

        if (!SynapseScheduler.isProcessing) {
            SynapseScheduler.processTasks();
        }
    }

    static processTasks() {
        if (SynapseScheduler.taskQueue.length === 0) {
            SynapseScheduler.isProcessing = false;
            return;
        }

        SynapseScheduler.isProcessing = true;
        const task = SynapseScheduler.taskQueue.shift(); // Get the next task

        if (task.priority === "high") {
            requestAnimationFrame(() => {
                task.node.reconcile(task.node.alternate);
                SynapseScheduler.processTasks();
            });
        } else {
            if (typeof requestIdleCallback !== "undefined") {
                requestIdleCallback((deadline) => {
                    while (deadline.timeRemaining() > 0 && task) {
                        task.node.reconcile(task.node.alternate);
                        break;
                    }
                    SynapseScheduler.processTasks();
                });
            } else {
                setTimeout(() => {
                    task.node.reconcile(task.node.alternate);
                    SynapseScheduler.processTasks();
                }, 16);
            }
        }
    }
}
