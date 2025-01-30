class ConnectionManager {
    constructor() {
        this.connections = [];
        this.connectionGraph = new Map();
    }

    addConnection(sourceId, targetId, socketType = 'default') {
        // Prevent duplicate connections
        if (!this.connections.some(conn => 
            conn.source === sourceId && conn.target === targetId && conn.type === socketType
        )) {
            this.connections.push({
                source: sourceId,
                target: targetId,
                type: socketType
            });
            
            if (!this.connectionGraph.has(sourceId)) {
                this.connectionGraph.set(sourceId, new Set());
            }
            this.connectionGraph.get(sourceId).add(targetId);
            
            this.detectCycles(sourceId);
        }
    }

    detectCycles(startId) {
        const visited = new Set();
        const stack = new Set();
        
        const dfs = (nodeId) => {
            if (stack.has(nodeId)) return true;
            if (visited.has(nodeId)) return false;
            
            visited.add(nodeId);
            stack.add(nodeId);
            
            const neighbors = this.connectionGraph.get(nodeId) || [];
            for (const neighbor of neighbors) {
                if (dfs(neighbor)) return true;
            }
            
            stack.delete(nodeId);
            return false;
        };
        
        if (dfs(startId)) {
            throw new Error(`Cycle detected involving component ${startId}`);
        }
    }

    getAllConnections() {
        return this.connections;
    }
}

module.exports = ConnectionManager;
