const { ErrorCode } = require('../utils/errors');

class ConnectionManager {
    constructor(errorReporter) {
        this.connections = [];
        this.dataFlowGraph = new Map();
        this.controlFlowGraph = new Map();
        this.errorReporter = errorReporter;
    }

    addConnection(sourceId, targetId, type = 'control', options = {}) {
        const connection = {
            id: `${sourceId}_${targetId}_${type}`,
            source: sourceId,
            target: targetId,
            type,
            variable: options.variable,
            socket: options.socket || 'default',
            location: options.location
        };

        if (!['control', 'data', 'error'].includes(type)) {
            this.errorReporter.reportError(
                ErrorCode.INVALID_CONNECTION,
                `Invalid connection type: ${type}`,
                null
            );
            return;
        }

        if (this.connections.some(c => 
            c.source === sourceId && 
            c.target === targetId && 
            c.type === type &&
            c.variable === options.variable
        )) {
            return;
        }

        switch(type) {
            case 'control':
                this._validateControlFlow(connection);
                break;
            case 'data':
                this._validateDataFlow(connection);
                break;
            case 'error':
                this._validateErrorFlow(connection);
                break;
        }

        this.connections.push(connection);
        this._updateGraphs(connection);
    }

    _validateControlFlow(conn) {
        if (this.wouldCreateCycle(conn.source, conn.target)) {
            this.errorReporter.reportError(
                ErrorCode.CYCLIC_DEPENDENCY,
                `Control flow cycle detected between ${conn.source} and ${conn.target}`,
                null
            );
        }
    }

    _validateDataFlow(conn) {
        if (!conn.variable) {
            this.errorReporter.reportError(
                ErrorCode.UNRESOLVED_IDENTIFIER,
                'Data flow connections require a variable name',
                null
            );
        }
    }

    wouldCreateCycle(source, target) {
        const visited = new Set();
        const stack = new Set();
        
        const dfs = (nodeId) => {
            if (nodeId === source) return true;
            if (visited.has(nodeId)) return false;
            
            visited.add(nodeId);
            stack.add(nodeId);
            
            const neighbors = this.controlFlowGraph.get(nodeId) || [];
            for (const neighbor of neighbors) {
                if (dfs(neighbor)) return true;
            }
            
            stack.delete(nodeId);
            return false;
        };
        
        return dfs(target);
    }

    _updateGraphs(conn) {
        const graph = conn.type === 'control' ? 
            this.controlFlowGraph : 
            this.dataFlowGraph;

        if (!graph.has(conn.source)) {
            graph.set(conn.source, new Set());
        }
        graph.get(conn.source).add(conn.target);
    }

    getAllConnections() {
        return this.connections;
    }
}

module.exports = ConnectionManager;
