export function DISPOSABLE(target: any) {
	/**
	 * @protected
	 */
	target.prototype._using = function _using<F extends Function>(disposables: F[]) {
		/**
		 * @private
		 */
		this._disposables = (this._disposables || []).concat(disposables);
	};

	/**
	 * Dispose
	 */
	target.prototype.dispose = function () {
		while (this._disposables.length !== 0) {
			this._disposables.pop()();
		}
	};

	return target;
}