class ScopeManager {
    constructor() {
        this.scopeStack = [this.createGlobalScope()];
    }

    createGlobalScope() {
        return {
            variables: new Map(),
            functions: new Map(),
            parent: null,
            type: 'global'
        };
    }

    enterScope(scopeType = 'block') {
        this.scopeStack.push({
            variables: new Map(),
            functions: new Map(),
            parent: this.currentScope(),
            type: scopeType
        });
    }

    exitScope() {
        if (this.scopeStack.length > 1) {
            this.scopeStack.pop();
        }
    }

    currentScope() {
        return this.scopeStack[this.scopeStack.length - 1];
    }

    declareVariable(name, componentId) {
        const scope = this.currentScope();
        scope.variables.set(name, componentId);
    }

    lookupVariable(name) {
        let current = this.currentScope();
        while (current) {
            if (current.variables.has(name)) {
                return current.variables.get(name);
            }
            current = current.parent;
        }
        return null;
    }

    declareFunction(name, componentId) {
        const scope = this.currentScope();
        scope.functions.set(name, componentId);
    }

    lookupFunction(name) {
        let current = this.currentScope();
        while (current) {
            if (current.functions.has(name)) {
                return current.functions.get(name);
            }
            current = current.parent;
        }
        return null;
    }
}

module.exports = ScopeManager;
