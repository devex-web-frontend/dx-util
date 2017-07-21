import { DISPOSABLE as fdisposable } from '../function/disposable';

export function DISPOSABLE(target: any): any {
	const disposable = fdisposable(target);
	//noinspection JSDuplicatedDeclaration
	const componentWillUnmount = disposable.prototype.componentWillUnmount;
	disposable.prototype.componentWillUnmount = function () {
		if (componentWillUnmount) {
			componentWillUnmount();
		}
		this.dispose();
	};
	return disposable;
}