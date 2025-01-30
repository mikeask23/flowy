const { ErrorCode } = require('../utils/errors');

class ComponentManager {
    constructor(errorReporter) {
        this.components = new Map();
        this.errorReporter = errorReporter;
        this.componentTypes = new Set([
            'variable', 'function_call', 'conditional', 'loop',
            'try', 'catch', 'finally', 'switch', 'case'
        ]);
    }

    createComponent(type, config, node) {
        if (!this.componentTypes.has(type)) {
            this.errorReporter.reportError(
                ErrorCode.INVALID_CONNECTION, 
                `Invalid component type: ${type}`,
                node
            );
            return null;
        }

        const component = {
            id: this.generateComponentId(type, node),
            type,
            name: config.name || '',
            props: this._sanitizeProps(config),
            location: this._getNodeLocation(node),
            connections: [],
            astNode: node
        };

        this.components.set(component.id, component);
        return component;
    }

    generateComponentId(type, node) {
        const line = node?.loc?.start.line || 0;
        const name = node.id?.name || node.declarations?.[0]?.id?.name || 'anon';
        return `${type}_${line}_${name}`.replace(/[^a-z0-9_]/gi, '_');
    }

    _getNodeLocation(node) {
        return node.loc ? {
            start: { line: node.loc.start.line, column: node.loc.start.column },
            end: { line: node.loc.end.line, column: node.loc.end.column }
        } : null;
    }

    _sanitizeProps(config) {
        return Object.fromEntries(
            Object.entries(config).filter(([k, v]) => 
                !k.startsWith('_') && v !== undefined
            )
        );
    }

    getComponent(id) {
        return this.components.get(id);
    }

    getAllComponents() {
        return Array.from(this.components.values());
    }

    addConnection(sourceId, targetId, socketType = 'default') {
        const component = this.components.get(sourceId);
        if (component) {
            component.connections.push({
                id: targetId,
                type: socketType
            });
        }
    }
}

module.exports = ComponentManager;
